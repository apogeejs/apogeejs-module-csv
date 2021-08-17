//These are in lieue of the import statements
let {Component,getFormComponentDefaultMemberJson} = apogeeapp;

const CSVComponentConfig = {
    componentClass: Component,
    displayName: "Parse CSV Cell",
    defaultMemberJson: getFormComponentDefaultMemberJson("apogeeapp.ParseCSVCell-data"),
    defaultComponentJson: {
        type: "apogeeapp.ParseCSVCell"
    }
}
export default CSVComponentConfig;
