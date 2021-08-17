//These are in lieue of the import statements
let {FormInputBaseComponentView,HandsonGridEditor,AceTextEditor,dataDisplayHelper,getErrorViewModeEntry} = apogeeview;

/** This is a graphing component using ChartJS. It consists of a single data table that is set to
 * hold the generated chart data. The input is configured with a form, which gives multiple options
 * for how to set the data. */
class CSVComponentView extends FormInputBaseComponentView {

    //=================================
    // Implementation Methods
    //=================================

    getHeaderViewDisplay(displayContainer) {
        let dataDisplaySource = this._getHeaderDataSource();
        let editor = new HandsonGridEditor(displayContainer,dataDisplaySource);
        editor.updateHeight(HEADER_GRID_PIXEL_HEIGHT);
        return editor;
    }

    getBodyViewDisplay(displayContainer) {
        //figure out if we want a grid or plain json
        let formResultMember = this.getComponent().getField("member.formResult");
        let formResultData = formResultMember.getData();
        let useMapsFormat = false;
        if(formResultData) {
            useMapsFormat = (formResultData.outputFormat == "maps");
        }

        let dataDisplaySource = this._getBodyDataSource(useMapsFormat);
        if(useMapsFormat) {
            return new AceTextEditor(displayContainer,dataDisplaySource,"ace/mode/json",AceTextEditor.OPTION_SET_DISPLAY_SOME);
        }
        else {
            return new HandsonGridEditor(displayContainer,dataDisplaySource);
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

//===============================
// View Config
//===============================

const CSVComponentViewConfig = {
    componentType: "apogeeapp.ParseCSVCell",
    viewClass: CSVComponentView,
    viewModes: [
        getErrorViewModeEntry(),
        {
            name: "Header",
            label: "Header",
            sourceLayer: "model", 
            sourceType: "data",
            suffix: ".data.header",
            isActive: false,
            getDataDisplay: (componentView,displayContainer) => componentView.getHeaderViewDisplay(displayContainer)
        },
        {
            name: "Data",
            label: "Data",
            sourceLayer: "model", 
            sourceType: "data",
            suffix: ".data.body",
            isActive: true,
            getDataDisplay: (componentView,displayContainer) => componentView.getBodyViewDisplay(displayContainer)
        },
        FormInputBaseComponentView.getConfigViewModeEntry(),
    ],
    hasTabEntry: false,
    hasChildEntry: true,
    iconResPath: "/icons3/gridCellIcon.png"
}
export default CSVComponentViewConfig;
//-----------------------
// Other random internal constants
//-----------------------

const JSON_TEXT_FORMAT_STRING = "\t";

const INPUT_HELP_TEXT = "This should be the name of a cell or a javascript expression that gives the raw CSV text. It will be converted to JSON format." + 
" To access this json value, use the expression <em>[cell name].data</em> to access the data rows and <em>[cell name].header</em>  to access the header row.";
const OUTPUT_FORMAT_HELP_TEXT = "The output can be an array of JSON objects or an array of arrays. For the JSON Objects the keys will be the column names."
const DYNAMIC_TYPING_HELP_TEXT = "Check this box to automatically convert numbers and booleans. If this is not selected, all data will be strings.";
const SKIP_EMPTY_HELP_TEXT = "Check this box to omit a row with no content, often the last row.";

const HEADER_GRID_PIXEL_HEIGHT = 75;


