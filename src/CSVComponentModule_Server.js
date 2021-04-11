import CSVComponentMember from "./CSVComponentMember.js";

const CSVComponentModule = {
    initApogeeModule: function() {
        //------------------------------
        // register the custom member
        //------------------------------
        CSVComponentMember.defineMember();
    },

    removeApogeeModule: function() {
        //------------------------------
        // unregister the custom member
        //------------------------------
        CSVComponentMember.undefineMember();
    }
}

export default CSVComponentModule;
