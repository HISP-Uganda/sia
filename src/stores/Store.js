import axios from 'axios';
import {generateUid} from '../utils/uid';
import {action, computed, extendObservable, observable} from 'mobx';
import {findIndex, flatten, fromPairs, uniq} from 'lodash';
import dayjs from 'dayjs';

const url = 'http://localhost:8888';
const apiUrl = `${url}/api`;
// eslint-disable-next-line no-undef
const socket = new SockJS('http://localhost:8888/eventbus');

const query = {
  dataSetElements: {
    resource: 'dataElements.json',
    params: {
      fields: 'id,name,code,categoryCombo[categoryOptionCombos[id,name]]',
      paging: 'false',
      filter: `domainType:eq:AGGREGATE`
    }
  },
  indicators: {
    resource: 'indicators.json',
    params: {
      fields: 'id,name,code,numerator,denominator,indicatorType[id,name]',
      paging: 'false'
    }
  },
  levels: {
    resource: 'organisationUnitLevels.json',
    params: {
      paging: 'false',
      fields: 'id,level,name'
    }
  },
  groups: {
    resource: 'organisationUnitGroups.json',
    params: {
      paging: 'false',
      fields: 'id,name,code'
    }
  }
};

const query1 = {
  me: {
    resource: 'me.json',
    params: {
      fields: 'organisationUnits[id,name,level]'
    }
  }
};

const query2 = {
  visualizations: {
    resource: 'dataStore/sia/visualizations'
  }
};

const query3 = {
  dashboards: {
    resource: 'dataStore/sia/dashboards'
  }
};


export class Indicator {
  @observable id = '';
  @observable name = '';
  @observable description = '';
  @observable numerator = '';
  @observable denominator = '1';
  @observable type = '';
  @observable numeratorDialogOpen = false;
  @observable denominatorDialogOpen = false;
  @observable numeratorSelectionEnd = 0;
  @observable denominatorSelectionEnd = 0;
  @observable isOrganisationCount = false;
  @observable levelCount = '';

  @action setNumeratorDialogOpen = (val) => this.numeratorDialogOpen = val;
  @action setName = (val) => this.name = val;
  @action setDescription = (val) => this.description = val;
  @action setIsOrganisationCount = (val) => this.isOrganisationCount = val;
  @action setLevelCount = (val) => this.levelCount = val;
  @action setDenominatorDialogOpen = (val) => this.denominatorDialogOpen = val;
  @action openNumeratorDialog = () => this.setNumeratorDialogOpen(true);
  @action openDenominatorDialog = () => this.setDenominatorDialogOpen(true);
  @action closeNumeratorDialog = () => this.setNumeratorDialogOpen(false);
  @action closeDenominatorDialog = () => this.setDenominatorDialogOpen(false);
  @action onClickNumerator = (event) => this.numeratorSelectionEnd = event.target.selectionStart;
  @action onClickDenominator = (event) => this.denominatorSelectionEnd = event.target.selectionStart;

  @action setNumerator = (event) => {
    this.numerator = event.target.value;
    this.numeratorSelectionEnd = event.target.selectionStart;
  };
  @action setDenominator = (event) => {
    this.denominator = event.target.value;
    this.denominatorSelectionEnd = event.target.selectionStart;
  };


  @action handleNumeratorPadClick = (id) => {
    if (this.numeratorSelectionEnd === 0) {
      this.numerator = id + this.numerator;
      this.numeratorSelectionEnd = this.numerator.length;
    } else if (this.numeratorSelectionEnd === this.numerator.length) {
      this.numerator = this.numerator + id;
      this.numeratorSelectionEnd = this.numerator.length;
    } else {
      const startString = this.numerator.substring(0, this.numeratorSelectionEnd) + id;
      const endString = this.numerator.substring(this.numeratorSelectionEnd, this.numerator.length);
      this.numerator = startString + endString;
      this.numeratorSelectionEnd = startString.length;
    }
  };

  @action handleDenominatorPadClick = (id) => {
    if (this.denominatorSelectionEnd === 0) {
      this.denominator = id + this.denominator;
      this.denominatorSelectionEnd = this.denominator.length;
    } else if (this.denominatorSelectionEnd === this.denominator.length) {
      this.denominator = this.denominator + id;
      this.denominatorSelectionEnd = this.denominator.length;
    } else {
      const startString = this.denominator.substring(0, this.denominatorSelectionEnd) + id;
      const endString = this.denominator.substring(this.denominatorSelectionEnd, this.denominator.length);
      this.denominator = startString + endString;
      this.denominatorSelectionEnd = startString.length;
    }
  };

  @computed get disabled() {
    return !this.numerator || this.numerator === ''
  }

  @computed get addEditNumerator() {
    return !this.disabled
  }

  @computed get addEditDenominator() {
    return this.denominator !== '1';
  }
}

export class DashboardItem {
  @observable id = generateUid();
  @observable w = 1;
  @observable h = 1;
  @observable x = 0;
  @observable y = 0;
  @observable isOnTheDashboard = false;
  @observable static = false;
  @observable dataElements = [];
  @observable indicators = [];
  @observable orgUnit;
  @observable disaggregatedByDate = false;
  @observable disaggregatedBySublevel = false;
  @observable disaggregatedBySpecificLevel = false;
  @observable orgUnitDisaggregationLevel = '';
  @observable data;
  @observable itemType = '';
  @observable name = '';
  @observable description = '';
  @observable stacked = false;
  @observable createdOn = dayjs().format("DD/MM/YYYY");
  @observable lastUpdated = dayjs().format("DD/MM/YYYY");

  @action changeStacked = (checked) => this.stacked = checked;
  @action enableSublevelAnalysis = async (checked) => {
    this.disaggregatedBySpecificLevel = false;
    this.data = null;
    this.disaggregatedBySublevel = checked;
    if (checked) {
      this.orgUnitDisaggregationLevel = `level${Number.parseInt(this.orgUnit.level, 10) + 1}`;
    } else {
      this.orgUnitDisaggregationLevel = '';
    }
    await this.fetchData();
  };

  @action enableDateAnalysis = async (checked) => {
    this.data = null;
    this.disaggregatedByDate = checked;
    await this.fetchData();
  };

  @action changeSpecificLevelAnalysis = async (e) => {
    this.data = null;
    this.orgUnitDisaggregationLevel = e;
    await this.fetchData()
  };

  @action enableSpecificLevelAnalysis = async (checked) => {
    this.data = null;
    this.disaggregatedBySublevel = false;
    this.orgUnitDisaggregationLevel = '';
    this.disaggregatedBySpecificLevel = checked;
    await this.fetchData()
  };

  @action handleChange = async (nextTargetKeys, direction, moveKeys) => {
    this.data = null;
    this.dataElements = nextTargetKeys;
    await this.fetchData()
  };

  @action changeSize = (w, h, x, y) => {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
  };
  @action setOrgUnit = (val) => this.orgUnit = val;
  @action disableEdit = () => this.static = true;
  @action enableEdit = () => this.static = false;
  @action setStatic = val => this.static = val;
  @action setData = (e) => this.data = e;
  @action changeDataElements = (e) => this.dataElements = e;
  @action changeDisaggregatedByDate = (e) => this.disaggregatedByDate = e.target.checked;
  @action changeItemType = (e) => this.itemType = e;
  @action changeName = (e) => this.name = e.target.value;
  @action changeDescription = (e) => this.description = e.target.value;

  @action fetchData = async () => {
    const elements = [...this.dataElements, ...this.dataElementsFromIndicators];
    if (elements.length > 0) {
      const requestData = {
        orgUnitSearchLevel: `level${this.orgUnit.level}`,
        orgUnit: this.orgUnit.id,
        disaggregatedByDate: this.disaggregatedByDate,
        orgUnitDisaggregationLevel: this.orgUnitDisaggregationLevel,
        dataElements: elements
      };
      try {
        const {data} = await axios.post(apiUrl, requestData);
        this.data = data;
      } catch (error) {
        console.error("Failed to fetch projects", error)
      }
    }
  };

  @action setIndicators = async (val) => {
    this.indicators = val;
    await this.fetchData();
  };

  @action
  addDataElement = async (dataElement) => {
    this.dataElements.push(dataElement);
    await this.fetchData();
  };

  @computed get calculated() {
    if (this.data) {
      return this.data.map((cu) => {
        const indicators = this.indicators.map((indicator) => {
          let num = indicator.numerator;
          let den = indicator.denominator
          const numerator = indicator.numerator.match(/#{\w+.?\w*}/g);
          const denominator = indicator.denominator.match(/#{\w+.?\w*}/g);
          if (numerator && (denominator || den === '1')) {
            numerator.forEach((de) => {
              const replacement = de.replace("#{", "cu['").replace("}", "']");
              num = num.replace(de, replacement);
            });

            let realDenominator = 1;

            if (den !== '1') {
              denominator.forEach((de) => {
                const replacement = de.replace("#{", "cu['").replace("}", "']");
                den = den.replace(de, replacement);
              });
              realDenominator = eval(den);
            }
            const realNumerator = eval(num);
            if (realDenominator > 0) {
              return [indicator.id, realNumerator * 100 / realDenominator]
            } else {
              return [indicator.id, 0]
            }
          } else {
            return [indicator.id, 0]
          }
        });
        return {...cu, ...fromPairs(indicators)}
      });
    }
    return [];
  }

  @computed get keys() {
    if (!this.disaggregatedByDate && this.orgUnitDisaggregationLevel === '') {
      return ['value']
    }
    const indicatorKeys = this.indicators.map((indicator) => indicator.id);
    return [...indicatorKeys, ...this.dataElements];
  }

  @computed get indexBy() {
    if (this.disaggregatedByDate && this.orgUnitDisaggregationLevel !== '') {
      return 'ou'
    } else if (this.disaggregatedByDate) {
      return 'date'
    } else if (this.orgUnitDisaggregationLevel !== '') {
      return 'ou'
    } else {
      return 'dx'
    }
  }

  @computed get heatMapData() {
    return {
      width: 900,
      height: 500,
      margin: {top: 60, right: 80, bottom: 60, left: 80},
      data: this.calculated,
      indexBy: this.indexBy,
      keys: this.keys,
    }
  }

  @computed get barGraphData() {
    let graph = {
      margin: {top: 50, right: 130, bottom: 50, left: 60},
      groupMode: this.stacked ? 'stacked' : 'grouped',
      data: this.calculated,
      indexBy: this.indexBy,
      keys: this.keys,
      padding: 0.2,
      labelTextColor: 'inherit:darker(1.4)',
      labelSkipWidth: 16,
      labelSkipHeight: 16,
      layout: 'vertical',
      axisLeft: {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Number',
        legendPosition: 'middle',
        legendOffset: -40
      },
      legends: [
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]
    };

    if (this.itemType === 'bar') {
      graph = {...graph, layout: 'horizontal'};
    }
    return graph;
  }

  @computed get dataElementsFromIndicators() {
    const dataElements = this.indicators.map((indicator) => {
      const numerator = indicator.numerator.match(/#{\w+.?\w*}/g);
      const denominator = indicator.denominator.match(/#{\w+.?\w*}/g);
      let allNumerators = [];
      let allDenominators = [];
      if (numerator && (denominator || indicator.denominator === '1')) {
        allNumerators = numerator.map((de) => {
          return de.replace("#{", "").replace("}", "");
        });
        if (indicator.denominator !== '1') {
          allDenominators = denominator.map((de) => {
            return de.replace("#{", "").replace("}", "");
          });
        }
      } else {
        console.log(numerator, denominator);
      }
      return uniq([...allNumerators, ...allDenominators]);
    })
    return uniq(flatten(dataElements));
  }

  @computed get configurations() {
    switch (this.itemType) {
      case 'column':
      case 'bar':
        return this.barGraphData;
      case 'heat':
        return this.heatMapData;
      default:
        return {data: []}
    }
  }

}

export class DashboardItemsGroup {
  @observable id = generateUid();
  @observable name = '';
  @observable description = '';
  @observable dashboardItems = [];
  @observable visible = true;
  @observable primary = false;

  @action changeName = (e) => this.name = e.target.value;
  @action changeDescription = (e) => this.description = e.target.value;
  @action setCurrentDashboardItems = (val) => this.dashboardItems = val

  @computed get items() {
    return this.dashboardItems.length;
  }

}

export class Dashboard {
  @observable id = generateUid();
  @observable name = '';
  @observable description = '';
  @observable status;
  @observable dashboardItemsGroups = [];
  @observable currentDashboardItemsGroup = new DashboardItemsGroup();

  @action changeName = (e) => this.name = e.target.value;
  @action changeDescription = (e) => this.description = e.target.value;
  @action setCurrentDashboardItemsGroup = (val) => this.currentDashboardItemsGroup = val;
  @action reset = () => this.currentDashboardItemsGroup = new DashboardItemsGroup();

  @action addDashboardItemGroup = () => {
    const index = findIndex(this.dashboardItemsGroups, {
      id: this.currentDashboardItemsGroup.id
    });

    if (index !== -1) {
      this.dashboardItemsGroups.splice(index, 1, this.currentDashboardItemsGroup);
    } else {
      this.dashboardItemsGroups = [...this.dashboardItemsGroups, this.currentDashboardItemsGroup];
    }
    this.currentDashboardItemsGroup = new DashboardItemsGroup();
  }
}

export class Store {
  @observable dashboards = [];
  @observable currentDashboard = new Dashboard();
  @observable engine;
  @observable data;
  @observable userOrgUnit = {};
  @observable dataSetElements = [];
  @observable organisationUnitGroups = [];
  @observable indicators = [];
  @observable organisationLevels = [];
  @observable search = {};
  @observable activeLinks = [];
  @observable currentIndicator = new Indicator();
  @observable dashboardItems = [];
  @observable currentDashboardItem = new DashboardItem();
  @observable dhis2Indicators = [];
  @observable fetching = false;

  constructor() {
    socket.onmessage = (e) => {
      this.currentDashboard.currentDashboardItemsGroup.dashboardItems.forEach(async (dbi) => {
        dbi.setOrgUnit(this.userOrgUnit);
        await dbi.fetchData();
      });
    }
  }

  @action setEngine = (engine) => this.engine = engine;
  @action setSearch = (field, val) => this.search = {[field]: val};
  @action addIndicator = (indicator) => this.indicators.push(indicator);
  @action setCurrentIndicator = (indicator) => this.currentIndicator = indicator;
  @action setDashboardItems = (dashboardItems) => this.dashboardItems = dashboardItems;
  @action searchChange = (field) => (event) => this.setSearch(field, event.target.value);

  @action setCurrentDashboard = (dashboard) => {
    this.currentDashboard = dashboard
    if (this.currentDashboard.dashboardItemsGroups.length > 0) {
      this.currentDashboard.setCurrentDashboardItemsGroup(this.currentDashboard.dashboardItemsGroups[0])
    }
  };

  @action fetchDataSetElements = async () => {
    const data = await this.engine.query(query);
    this.dataSetElements = data.dataSetElements.dataElements;
    this.organisationLevels = data.levels.organisationUnitLevels;
    this.organisationUnitGroups = data.groups.organisationUnitGroups;
    this.indicators = data.indicators.indicators;
  };

  @action fetchOrganisations = async () => {
    const data = await this.engine.query(query1);
    if (data.me.organisationUnits.length > 0) {
      this.userOrgUnit = data.me.organisationUnits[0];
    }
  };

  @action fetchVisualizations = async () => {
    try {
      const {visualizations} = await this.engine.query(query2);
      this.dashboardItems = visualizations.map(vis => {
        const item = new DashboardItem();
        extendObservable(item, {...vis});
        return item
      });
    } catch (e) {

      let createMutation = {
        type: 'create',
        resource: 'dataStore/sia/visualizations',
        data: []
      };
      try {
        await this.engine.mutate(createMutation);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    }
  };

  @action fetchDashboards = async (disableEdit = false) => {
    try {
      const {dashboards} = await this.engine.query(query3);
      this.dashboards = dashboards.map(dashboard => {
        const {id, name, description, dashboardItemsGroups} = dashboard;
        const currentBoard = new Dashboard();
        const itemGroups = dashboardItemsGroups.map(group => {
          const {id, name, description, dashboardItems} = group;
          const currentGroup = new DashboardItemsGroup();
          const items = dashboardItems.map(item => {
            const currentItem = new DashboardItem();
            extendObservable(currentItem, item);
            currentItem.setStatic(disableEdit);
            return currentItem;
          });
          extendObservable(currentGroup, {id, name, description, dashboardItems: items});
          return currentGroup;
        })
        extendObservable(currentBoard, {name, description, id, dashboardItemsGroups: itemGroups});
        return currentBoard;
      });

      this.setCurrentDashboard(this.dashboards[0]);
    } catch (e) {
      let createMutation = {
        type: 'create',
        resource: 'dataStore/sia/dashboards',
        data: []
      };
      try {
        await this.engine.mutate(createMutation);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    }
  };

  @action saveVisualization = async () => {
    const index = findIndex(this.dashboardItems, {
      id: this.currentDashboardItem.id
    });

    if (index !== -1) {
      this.dashboardItems.splice(index, 1, this.currentDashboardItem);
    } else {
      this.dashboardItems = [...this.dashboardItems, this.currentDashboardItem];
    }
    let createMutation = {
      type: 'update',
      resource: 'dataStore/sia/visualizations',
      data: this.dashboardItems
    };
    try {
      await this.engine.mutate(createMutation);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  @action saveDashboard = async () => {
    const index = findIndex(this.dashboards, {
      id: this.currentDashboard.id
    });

    if (index !== -1) {
      this.dashboards.splice(index, 1, this.currentDashboard);
    } else {
      this.dashboards = [...this.dashboards, this.currentDashboard];
    }
    let createMutation = {
      type: 'update',
      resource: 'dataStore/sia/dashboards',
      data: this.dashboards
    };
    try {
      await this.engine.mutate(createMutation);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  @action changeData = async () => {
    const promises = this.currentDashboard.currentDashboardItemsGroup.dashboardItems.map(item => {
      item.setOrgUnit(this.userOrgUnit);
      // console.log(item);
      return item.fetchData();
    });
    await Promise.all(promises);
  };

  @action runAll = async () => {
    this.fetching = true;
    await this.fetchOrganisations();
    await this.fetchDashboards(true);
    await this.changeData();
    this.fetching = false;
  }

  @computed get searchedDataElements() {
    const search = this.search['dataElements'];
    if (search && search !== '') {
      return this.dataSetElements.filter((dataElement) => {
        return dataElement.name.toLowerCase().includes(search.toLowerCase()) ||
          (dataElement.code && dataElement.code.toLowerCase().includes(search.toLowerCase())) ||
          (dataElement.id && dataElement.id.includes(search));
      });
    }
    return this.dataSetElements;
  }

  @computed get searchedOUGroups() {
    const search = this.search['ouGroups'];
    if (search && search !== '') {
      return this.organisationUnitGroups.filter((ouGroup) => {
        return ouGroup.name.toLowerCase().includes(search.toLowerCase()) || (ouGroup.code && ouGroup.code.toLowerCase().includes(search.toLowerCase()));
      });
    }
    return this.organisationUnitGroups;
  }

  @computed get finalElements() {
    return this.dataSetElements.map((e) => {
      return {
        key: e.id,
        title: e.name,
        description: e.name,
        disabled: false
      }
    })
  }

  @computed get finalIndicators() {
    return this.indicators.map((e) => {
      return {
        key: e.id,
        title: e.name,
        description: e.name,
        disabled: false
      }
    })
  }

  @computed get finalVisualizations() {
    return this.dashboardItems.map((e) => {
      return {
        key: e.id,
        title: e.name,
        description: e.name,
        disabled: false
      }
    })
  }

  @computed get currentDashboardItemGroup() {
    return this.currentDashboard.currentDashboardItemsGroup.id;
  }
}


export const createStore = () => {
  return new Store()
};
