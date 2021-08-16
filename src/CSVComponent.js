//These are in lieue of the import statements
let {Component,getFormComponentDefaultMemberJson} = apogeeapp;

/** This is a simple custom component example. */
export default class CSVComponent extends Component {}

CSVComponent.CLASS_CONFIG = {
    displayName: "Parse CSV Cell",
    defaultMemberJson: getFormComponentDefaultMemberJson("apogeeapp.ParseCSVCell-data"),
    defaultComponentJson: {
        type: "apogeeapp.ParseCSVCell"
    }
}
