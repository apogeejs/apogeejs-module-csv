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

        //-------------------------------
        //register the parse csv component view
        //-------------------------------
        apogeeview.registerComponentView(CSVComponentViewConfig);
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

        //-------------------------------
        //register the parse csv component view
        //-------------------------------
        apogeeview.unregisterComponentView(CSVComponentViewConfig);
    },

    getDataExport: function() {
        return CSVComponentMember.getModelDataExport();
    }
}

export {CSVComponentModule as default};
