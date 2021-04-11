// File: apogeejs-module-csv-server
// Version: 1.3.4
// Copyright (c) 2016-2021 Dave Sutter
// License: MIT

'use strict';

var papaparse = require('papaparse');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var papaparse__default = /*#__PURE__*/_interopDefaultLegacy(papaparse);

//this makes the papaparse library available globally
__globals__.papaparse = papaparse__default['default'];

const CSVComponentMember = {
    defineMember: function() {
        apogee.defineHardcodedJsonTable(DATA_MEMBER_TYPE_NAME,DATA_MEMBER_FUNCTION_BODY);
    },

    undefineMember: function() {
        apogee.Model.removeMemberGenerator(DATA_MEMBER_TYPE_NAME);
    }
};

//NOTE ON NAMING - the standard name for this would be "apogee.ParseCSVMember"
//but this member name is kept for legacy reasons
const DATA_MEMBER_TYPE_NAME = "apogeeapp.ParseCSVCell-data";

//this is the function body for out member
//we define the content in a global function (below)
const DATA_MEMBER_FUNCTION_BODY = `
    if((formResult)&&(formResult.input)) {
        let options = {};
        options.dynamicTyping = formResult.dynamicTyping;
        options.skipEmptyLines = formResult.skipEmptyLines;
        options.header = (formResult.outputFormat == "maps");
        let parseResult = __papaparse.parse(formResult.input,options);
        if(parseResult.errors.length == 0) {
            let headerRow;
            let body;
            if(options.header) {
                //row of objects
                headerRow = parseResult.meta.fields;
                body = parseResult.data;
            }
            else {
                body = [];
                if((parseResult.data)&&(parseResult.data.length > 0)) {                
                    parseResult.data.forEach( (row,index) => {
                        if(index == 0) {
                            headerRow = row;
                        }
                        else {
                            body.push(row);
                        }
                    });            
                }
            }

            if(!headerRow) headerRow = [];
            return {
                header: headerRow,
                body: body
            };
        }
        else {
            let errorMsg = "Parsing Error: " + parseResult.errors.join(";");
            throw new Error(errorMsg);
        }
    }
    else {
        return {
            header: [],
            body: [[]]
        };
    }
`;

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
};

module.exports = CSVComponentModule;
