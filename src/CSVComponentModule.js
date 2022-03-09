import CSVComponentMember from "./CSVComponentMember.js";
import CSVComponentConfig from "./CSVComponent.js";
import CSVComponentViewConfig from "./CSVComponentView.js";

const CSVComponentModule = {
    initApogeeModule: function() {
        //------------------------------
        // register the custom member
        //------------------------------
        CSVComponentMember.defineMember();

        //-------------------------------
        //register the parse csv component
        //-------------------------------
        apogeeapp.componentInfo.registerComponent(CSVComponentConfig);
    },

    removeApogeeModule: function() {
        //------------------------------
        // unregister the custom member
        //------------------------------
        CSVComponentMember.undefineMember();

        //-------------------------------
        //register the parse csv component
        //-------------------------------
        apogeeapp.componentInfo.unregisterComponent(CSVComponentConfig);
    },

    getDataExport: function() {
        return CSVComponentMember.getModelDataExport();
    }
}

export {CSVComponentModule as default};
