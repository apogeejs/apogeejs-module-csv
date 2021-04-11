//These are in lieue of the import statements
let {FormInputBaseComponent} = apogeeapp;

/** This is a simple custom component example. */
export default class CSVComponent extends FormInputBaseComponent {
    constructor(member,modelManager,instanceToCopy,keepUpdatedFixed) {
        super(member,modelManager,instanceToCopy,keepUpdatedFixed);
    }
}

FormInputBaseComponent.initializeClass(CSVComponent,"Parse CSV Cell","apogeeapp.ParseCSVCell","apogeeapp.ParseCSVCell-data");
