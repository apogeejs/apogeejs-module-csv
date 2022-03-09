//These are in lieue of the import statements
let {FormInputBaseComponentView,HandsonGridEditor,AceTextEditor,dataDisplayHelper,getErrorViewModeEntry} = apogeeapp;

/** This is a graphing component using ChartJS. It consists of a single data member that is set to
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
                //Here we return just body part of the data
                let wrappedData = dataDisplayHelper.getWrappedMemberData(this,"member.data");
                if(wrappedData.data != apogeeutil.INVALID_VALUE) {
                    let allData = wrappedData.data;
                    let bodyData
                    if(allData) bodyData = allData.body;
                    if(useMapsFormat) {
                        if(!bodyData) bodyData = [];
                        //return text for text editor
                        wrappedData.data = JSON.stringify(bodyData,null,JSON_TEXT_FORMAT_STRING);
                    }
                    else {
                        //return json for grid editor
                        if(!bodyData) bodyData = [[]];
                        wrappedData.data = bodyData;
                    }
                }

                return wrappedData;
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
                //Here we return just header part of the data
                let wrappedData = dataDisplayHelper.getWrappedMemberData(this,"member.data");
                if(wrappedData.data != apogeeutil.INVALID_VALUE) {
                    let allData = wrappedData.data;
                    let headerData
                    if(allData) headerData = allData.body;
                    if(headerData) {
                        return [headerData]
                    }
                    else {
                        return []
                    }
                }

                return wrappedData;
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


