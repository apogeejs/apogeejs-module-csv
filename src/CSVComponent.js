//These are in lieue of the import statements
let {Component,getFormComponentDefaultMemberJson} = apogeeapp;

/** This is a simple custom component example. */
export default class CSVComponent extends Component {
    constructor(member,modelManager,instanceToCopy,keepUpdatedFixed) {
        super(member,modelManager,instanceToCopy,keepUpdatedFixed);
    }
}

CSVComponent.CLASS_CONFIG = {
    displayName: "Parse CSV Cell",
    uniqueName: "apogeeapp.ParseCSVCell",
    defaultMemberJson: getFormComponentDefaultMemberJson("apogeeapp.ParseCSVCell-data")
}
