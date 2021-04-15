// File: apogeejs-module-csv
// Version: 1.3.4
// Copyright (c) 2016-2021 Dave Sutter
// License: MIT

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var papaparse = _interopDefault(require('papaparse'));

//this makes the papaparse library available globally
__globals__.__papaparse = papaparse;

const CSVComponentMember = {
    defineMember: function() {
        apogee.defineHardcodedJsonTable(DATA_MEMBER_TYPE_NAME,DATA_MEMBER_FUNCTION_BODY);
    },

    undefineMember: function() {
        apogee.Model.removeMemberGenerator(DATA_MEMBER_TYPE_NAME);
    }
};

//NOTE ON NAMING - the standard name for this would be "apogee.ParseCSVMember"
//but this member name is kept for legacy reasons
const DATA_MEMBER_TYPE_NAME = "apogeeapp.ParseCSVCell-data";

//this is the function body for out member
//we define the content in a global function (below)
const DATA_MEMBER_FUNCTION_BODY = `
    if((formResult)&&(formResult.input)) {
        let options = {};
        options.dynamicTyping = formResult.dynamicTyping;
        options.skipEmptyLines = formResult.skipEmptyLines;
        options.header = (formResult.outputFormat == "maps");
        let parseResult = __papaparse.parse(formResult.input,options);
        if(parseResult.errors.length == 0) {
            let headerRow;
            let body;
            if(options.header) {
                //row of objects
                headerRow = parseResult.meta.fields;
                body = parseResult.data;
            }
            else {
                body = [];
                if((parseResult.data)&&(parseResult.data.length > 0)) {                
                    parseResult.data.forEach( (row,index) => {
                        if(index == 0) {
                            headerRow = row;
                        }
                        else {
                            body.push(row);
                        }
                    });            
                }
            }

            if(!headerRow) headerRow = [];
            return {
                header: headerRow,
                body: body
            };
        }
        else {
            let errorMsg = "Parsing Error: " + parseResult.errors.join(";");
            throw new Error(errorMsg);
        }
    }
    else {
        return {
            header: [],
            body: [[]]
        };
    }
`;

//These are in lieue of the import statements
let {FormInputBaseComponent} = apogeeapp;

/** This is a simple custom component example. */
class CSVComponent extends FormInputBaseComponent {
    constructor(member,modelManager,instanceToCopy,keepUpdatedFixed) {
        super(member,modelManager,instanceToCopy,keepUpdatedFixed);
    }
}

FormInputBaseComponent.initializeClass(CSVComponent,"Parse CSV Cell","apogeeapp.ParseCSVCell","apogeeapp.ParseCSVCell-data");

//These are in lieue of the import statements
let {FormInputBaseComponentView,HandsonGridEditor,AceTextEditor,StandardErrorDisplay,dataDisplayHelper} = apogeeview;

/** This is a graphing component using ChartJS. It consists of a single data table that is set to
 * hold the generated chart data. The input is configured with a form, which gives multiple options
 * for how to set the data. */
class CSVComponentView extends FormInputBaseComponentView {

    constructor(appViewInterface,component) {
        super(appViewInterface,component);
    };

    //=================================
    // Implementation Methods
    //=================================

    /**  This method retrieves the table edit settings for this component instance
     * @protected */
    getTableEditSettings() {
        return CSVComponentView.TABLE_EDIT_SETTINGS;
    }

    /** This method should be implemented to retrieve a data display of the give type. 
     * @protected. */
    getDataDisplay(displayContainer,viewType) {
        let dataDisplaySource;
        switch(viewType) {

            case CSVComponentView.VIEW_HEADER:
                dataDisplaySource = this._getHeaderDataSource();
                let editor = new HandsonGridEditor(displayContainer,dataDisplaySource);
                editor.updateHeight(HEADER_GRID_PIXEL_HEIGHT);
                return editor;

            case CSVComponentView.VIEW_DATA:
                //figure out if we want a grid or plain json
                let formResultMember = this.getComponent().getField("member.formResult");
                let formResultData = formResultMember.getData();
                let useMapsFormat = false;
                if(formResultData) {
                    useMapsFormat = (formResultData.outputFormat == "maps");
                }

                dataDisplaySource = this._getBodyDataSource(useMapsFormat);
                if(useMapsFormat) {
                    return new AceTextEditor(displayContainer,dataDisplaySource,"ace/mode/json",AceTextEditor.OPTION_SET_DISPLAY_SOME);
                }
                else {
                    return new HandsonGridEditor(displayContainer,dataDisplaySource);
                }

            case CSVComponentView.VIEW_INPUT:
                return this.getFormDataDisplay(displayContainer);

            case FormInputBaseComponentView.VIEW_INFO: 
                dataDisplaySource = dataDisplayHelper.getStandardErrorDataSource(this.getApp(),this);
                return new StandardErrorDisplay(displayContainer,dataDisplaySource);

            default:
                console.error("unrecognized view element: " + viewType);
                return null;
        }
    }

    /** This method returns the form layout.
     * @protected. */
    getFormLayout() {
        return [
            {
                type: "textField",
                label: "Input Text Data: ",
                size: 60,
                key: "input",
                hint: "reference",
                help: INPUT_HELP_TEXT,
                meta: {
                    expression: "simple",
                    excludeValue: ""
                }
            },
            {
                type: "radioButtonGroup",
                label: "Output Format: ",
                entries: [["Array of Objects","maps"],["Array of Arrays (Grid)","arrays"]],
                value: "maps",
                key: "outputFormat",
                help: OUTPUT_FORMAT_HELP_TEXT
            },
            {
                type: "checkbox",
                label: "Dynamic Typing: ",
                value: true,
                key: "dynamicTyping",
                help: DYNAMIC_TYPING_HELP_TEXT
            },
            {
                type: "checkbox",
                label: "Skip Empty Lines: ",
                value: true,
                key: "skipEmptyLines",
                help: SKIP_EMPTY_HELP_TEXT
            }
        ]
    }

    //==========================
    // Private Methods
    //==========================

    _getBodyDataSource(useMapsFormat) {
        return {
            doUpdate: () => {
                //return value is whether or not the data display needs to be udpated
                let reloadData = this.getComponent().isMemberDataUpdated("member.data");
                //we only need to reload if the output format changes, but for now we will reload for any input change 
                let reloadDataDisplay = this.getComponent().isMemberDataUpdated("member.formData");
                return {reloadData,reloadDataDisplay};
            },
    
            getData: () => {
                //here we need to extract data from the member so we return
                //the starndard wrapped data for the non-normal case and 
                //extract the proper data for the normal case, returning
                //unwrapped data in that case.
                let allDataMember = this.getComponent().getField("member.data");
				if(allDataMember.getState() != apogeeutil.STATE_NORMAL) {
					return dataDisplayHelper.getStandardWrappedMemberData(allDataMember);
				}
				else {
					let allData = allDataMember.getData();
					if(allData != apogeeutil.INVALID_VALUE) {
                        let bodyData = allData.body;
                        if(useMapsFormat) {
                            if(!bodyData) bodyData = [];
                            //return text for text editor
                            return JSON.stringify(bodyData,null,JSON_TEXT_FORMAT_STRING);
                        }
                        else {
                            //return json for grid editor
                            if(!bodyData) bodyData = [[]];
                            return bodyData;
                        }
					}
					else {
						return apogeeutil.INVALID_VALUE
					}
				}
            }
        }
    }

    _getHeaderDataSource() {
        return {
            doUpdate: () => {
                //return value is whether or not the data display needs to be udpated
                let reloadData = this.getComponent().isMemberDataUpdated("member.data");
                //we only need to reload if the output format changes, but for now we will reload for any input change 
                let reloadDataDisplay = this.getComponent().isMemberDataUpdated("member.formData");
                return {reloadData,reloadDataDisplay};
            },
    
            getData: () => {
                //here we need to extract data from the member so we return
                //the starndard wrapped data for the non-normal case and 
                //extract the proper data for the normal case, returning
                //unwrapped data in that case.
                let allDataMember = this.getComponent().getField("member.data");
				if(allDataMember.getState() != apogeeutil.STATE_NORMAL) {
					return dataDisplayHelper.getStandardWrappedMemberData(allDataMember);
				}
				else {
					let allData = allDataMember.getData();
					if(allData != apogeeutil.INVALID_VALUE) {
                        let header = allData.header;
                        if(header) {
                            return [header]
                        }
                        else {
                            return []
                        }
					}
					else {
						return apogeeutil.INVALID_VALUE
					}
				}
            }
        }
    }

}

//======================================
// Static properties
//======================================

//===================================
// View Definitions Constants (referenced internally)
//==================================

CSVComponentView.VIEW_HEADER = "Header";
CSVComponentView.VIEW_DATA = "Data";

CSVComponentView.VIEW_MODES = [
    FormInputBaseComponentView.VIEW_INFO_MODE_ENTRY,
    {name: CSVComponentView.VIEW_HEADER, label: "Header", isActive: false},
    {name: CSVComponentView.VIEW_DATA, label: "Data", isActive: false},
    FormInputBaseComponentView.INPUT_VIEW_MODE_INFO
];

CSVComponentView.TABLE_EDIT_SETTINGS = {
    "viewModes": CSVComponentView.VIEW_MODES
};


//===============================
// Required External Settings
//===============================

/** This is the component name with which this view is associated. */
CSVComponentView.componentName = "apogeeapp.ParseCSVCell";

/** If true, this indicates the component has a tab entry */
CSVComponentView.hasTabEntry = false;
/** If true, this indicates the component has an entry appearing on the parent tab */
CSVComponentView.hasChildEntry = true;

/** This is the icon url for the component. */
CSVComponentView.ICON_RES_PATH = "/icons3/gridCellIcon.png";

//-----------------------
// Other random internal constants
//-----------------------

const JSON_TEXT_FORMAT_STRING = "\t";

const INPUT_HELP_TEXT = "This should be the name of a cell or a javascript expression that gives the raw CSV text. It will be converted to JSON format." + 
" To access this json value, use the expression <em>[cell name].data</em> to access the data rows and <em>[cell name].header</em>  to access the header row.";
const OUTPUT_FORMAT_HELP_TEXT = "The output can be an array of JSON objects or an array of arrays. For the JSON Objects the keys will be the column names.";
const DYNAMIC_TYPING_HELP_TEXT = "Check this box to automatically convert numbers and booleans. If this is not selected, all data will be strings.";
const SKIP_EMPTY_HELP_TEXT = "Check this box to omit a row with no content, often the last row.";

const HEADER_GRID_PIXEL_HEIGHT = 75;

const CSVComponentModule = {
    initApogeeModule: function() {
        //------------------------------
        // register the custom member
        //------------------------------
        CSVComponentMember.defineMember();

        //-------------------------------
        //register the parse csv component
        //-------------------------------
        apogeeapp.componentInfo.registerComponent(CSVComponent);

        //-------------------------------
        //register the parse csv component view
        //-------------------------------
        apogeeview.registerComponentView(CSVComponentView);
    },

    removeApogeeModule: function() {
        //------------------------------
        // unregister the custom member
        //------------------------------
        CSVComponentMember.undefineMember();

        //-------------------------------
        //register the parse csv component
        //-------------------------------
        apogeeapp.componentInfo.unregisterComponent(CSVComponent);

        //-------------------------------
        //register the parse csv component view
        //-------------------------------
        apogeeview.unregisterComponentView(CSVComponentView);
    }
};

module.exports = CSVComponentModule;
