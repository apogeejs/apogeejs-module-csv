//These are in lieue of the import statements
let {Component,getFormComponentDefaultMemberJson} = apogeeapp;

/** This is a simple custom component example. */
export default class CSVComponent extends Component {
    constructor(member,modelManager,instanceToCopy,keepUpdatedFixed) {
        super(member,modelManager,instanceToCopy,keepUpdatedFixed);
    }
}

CSVComponent.displayName = "Parse CSV Cell"
CSVComponent.uniqueName = "apogeeapp.ParseCSVCell";
CSVComponent.DEFAULT_MEMBER_JSON = getFormComponentDefaultMemberJson("apogeeapp.ParseCSVCell-data");
