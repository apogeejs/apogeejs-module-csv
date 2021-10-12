import papaparse from "../lib/papaparse.es.js";

const CSVComponentMember = {
    defineMember: function() {
        apogee.defineHardcodedDataMember(DATA_MEMBER_TYPE_NAME,DATA_MEMBER_FUNCTION_BODY);
    },

    undefineMember: function() {
        apogee.Model.removeMemberGenerator(DATA_MEMBER_TYPE_NAME);
    },

    getModelDataExport: function() {
        return modelDataExport;
    }
}

export {CSVComponentMember as default};

//NOTE ON NAMING - the standard name for this would be "apogee.ParseCSVMember"
//but this member name is kept for legacy reasons
const DATA_MEMBER_TYPE_NAME = "apogeeapp.ParseCSVCell-data";

//this is the function body for out member
//we define the content in a global function (below)
const DATA_MEMBER_FUNCTION_BODY = `    
let csvData = apogeeModuleExport("apogeejs-module-csv");
return csvData.parseData(formResult);
`

let parseData = function(formResult) {
    if((formResult)&&(formResult.input)) {
        let options = {};
        options.dynamicTyping = formResult.dynamicTyping;
        options.skipEmptyLines = formResult.skipEmptyLines;
        options.header = (formResult.outputFormat == "maps");
        let parseResult = papaparse.parse(formResult.input,options);
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
}

let modelDataExport = {};

modelDataExport.parseData = parseData;
