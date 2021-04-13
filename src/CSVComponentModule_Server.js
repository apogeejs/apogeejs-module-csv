import CSVComponentMember from "./CSVComponentMember.js";

/** This is a version of the CSV Component Module to be used on the apogee server, as opposed
 * to the apogee app. */
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
