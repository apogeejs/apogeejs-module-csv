import CSVComponentMember from "./CSVComponentMember.js";
import CSVComponent from "./CSVComponent.js";
import CSVComponentView from "./CSVComponentView.js";

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
}

export {CSVComponentModule as default};
