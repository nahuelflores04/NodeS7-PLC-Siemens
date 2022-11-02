/*
Las funciones de controlador de PLC estan definidas en node_modules en la carpeta nodeS7 (nodeS7.js).
Se modificaron algunas lineas de código de la libreria para no visualizar los outputsLog de las lecturas del PLC
Para modificar debe ingresar a node_modules/nodeS7/nodeS7.js y ver las lineas de codigo comentadas
*/

import nodes7 from "nodes7";

var conn = new nodes7();
var doneReading = false;
var doneWriting = false;
let test_final = 0;
export let status_plc = false;
export let layer_counter;
export let finished_layers;

var ip = "10.106.10.17"

var variables = {
  TEST1: "DB20,R2", // Mts de tela PLC (lectura) - db20.dbd2 DB20,DI2 -- Memory real at MD4
  TEST2: "DB21,X0.0", // HeartBeat bit
  TEST3: "BD21,X0.1", // Comenzar a contar
  TEST4: "DB21,X0.2", // Reset contador de mts (db21.dbx0.2)
  TEST5: "DB20,X0.0", //
  TEST6: "DB21,X0.3", //Reset de pulsador de defectos
  TEST7: "DB20,X6.0", //Leer bloque
  TEST8: "DB20,W8", //Contador de capas, INT
  TEST9: "DB21,X0.4" //Señal luz verde: cantidad de capas = capas programadas. Boolean

  //Memorias para conteo de cantidad de capas del kit y cantidad de marcas por rollo.
  /*TEST5: 'DB1,REAL4',    // Single real value
  TEST6: 'DB1,REAL8',    // Another single real value
  TEST7: 'DB1,INT12.2',  // Two integer value array
  TEST8: 'DB1,LREAL4',   // Single 8-byte real value
  TEST9: 'DB1,X14.0',    // Single bit in a data block
  TEST10: 'DB1,X14.0.8'  // Array of 8 bits in a data block*/
};
export let array_values;
export let mts_reales_plc;

export async function connectPLCtoReset() {
  conn.initiateConnection(
    { port: 102, host: ip , rack: 0, slot: 1, debug: false },
    (err) => {
      if (typeof err !== "undefined") {
        //console.log(err);
        status_plc = true;
      }
      conn.setTranslationCB(function (tag) {
        return variables[tag];
      }); // This sets the "translation" to allow us to work with object names
      conn.addItems(["TEST1"]);
      //conn.writeItems('TEST1', false, valuesWritten);
      let x;
      conn.readAllItems((err, values) => {
        if (err) {
          //console.log("Ocurrió un error al leer la memoria del PLC");
        }
        //mts_reales_plc = values.TEST1

        async function metros() {
          let mt;
          if (mts_reales_plc != 0) {
            //mt = mts_reales_plc
            //console.log ("Test dentro de funcion metros()", test_final)
          }
          //console.log ("nuevo test funcion metros():", mt)
          conn.writeItems("TEST4", true, valuesWritten);
          return mt;
        }
        test_final = metros();
        //console.log ("test valor", test_final);
        doneReading = true;
        if (doneWriting) {
          //console.log("done Writing");
          //conn.connectionCleanup()
        }
        return test_final;
      });
    }
  );
}

export async function connectPLCtoRead() {
  conn.initiateConnection(
    { port: 102, host: ip, rack: 0, slot: 1, debug: false },
    (err) => {
      if (typeof err !== "undefined") {
        console.log(err);
        status_plc = true;
      }else{
        status_plc = false;
      }
      conn.setTranslationCB(function (tag) {
        return variables[tag];
      }); // This sets the "translation" to allow us to work with object names
      conn.addItems(["TEST1"]);
      conn.addItems(["TEST8"]);
      //conn.writeItems('TEST1', false, valuesWritten);
      let x;
      conn.readAllItems((err, values) => {
        if (err) {
          //console.log("Ocurrió un error al leer la memoria del PLC");
        }
        mts_reales_plc = values.TEST1;
        layer_counter = values.TEST8;
        
        async function metros() {
          let mt;
          if (mts_reales_plc != 0) {
            mt = mts_reales_plc;
            //console.log ("Test dentro de funcion metros()", test_final)
          }
          //console.log("nuevo test funcion metros():", mt);
          conn.writeItems("TEST4", true, valuesWritten);
          return mt;
        }
        test_final = metros();
        //console.log("test valor", test_final);
        doneReading = true;
        if (doneWriting) {
          //console.log("done Writing");
          //conn.connectionCleanup()
        }
        return test_final;
      });
    }
  );
};
export let statusPulse;
//Este pulsador ahora migraría a la estación 1010A (calidad);

export async function connectToPulse(anythingBad) {
  conn.initiateConnection(
    { port: 102, host: ip, rack: 0, slot: 1, debug: false },
    (err) => {
      if (typeof err !== "undefined") {
        console.log(err);
        status_plc = true;
      }else{
        status_plc = false;
      }
      conn.setTranslationCB(function (tag) {
        return variables[tag];
      }); // This sets the "translation" to allow us to work with object names
      conn.addItems(["TEST6"]);
      conn.addItems(["TEST7"]);
      conn.readAllItems((err, values) => {
        if (err) {
          console.log("Ocurrió un error al leer la memoria del PLC");
        }
        let reset = values.TEST6
        statusPulse = values.TEST7;
        console.log(statusPulse)
        conn.connectionCleanup();
      });
    });
};

export async function resetOnTrue(anythingBad){
  conn.initiateConnection(
    { port: 102, host: ip, rack: 0, slot: 1, debug: false },
    (err) => {
      if (typeof err !== "undefined") {
        console.log(err);
        status_plc = true;
      }else{
        status_plc = false;
      };
      conn.setTranslationCB(function (tag) {
        return variables[tag];
      }); // This sets the "translation" to allow us to work with object names
      //conn.addItems(["TEST6"]);
      conn.addItems(["TEST6"]);
      conn.writeItems("TEST6", true, resetTrue)
    });
};

export async function resetOnFalse(anythingBad){
  conn.initiateConnection(
    { port: 102, host: ip, rack: 0, slot: 1, debug: false },
    (err) => {
      if (typeof err !== "undefined") {
        console.log(err);
        status_plc = true;
      }else{
        status_plc = false;
      }
      conn.setTranslationCB(function (tag) {
        return variables[tag];
      }); // This sets the "translation" to allow us to work with object names
      //conn.addItems(["TEST6"]);
      conn.addItems(["TEST6"]);
      conn.writeItems("TEST6", true, resetFalse)
    });
};

function resetTrue(anythingBad) {
  if (anythingBad) {
    //console.log("Ocurrió un error al leer la memoria del PLC");
  }
  conn.writeItems("TEST6", true, resetTrue);
  conn.writeItems("TEST6", false, resetFalse);
  doneWriting = true;
  if (doneWriting) {
    conn.connectionCleanup();
  };
};

function resetFalse(anythingBad){
  if (anythingBad) {
    //console.log("Ocurrió un error al leer la memoria del PLC");
  }
  conn.writeItems("TEST6", false, resetFalse);
  doneWriting = true;
  if (doneWriting) {
    conn.connectionCleanup();
  };
}

//Escritura en 0 si es necesario
function valuesWritten(anythingBad) {
  if (anythingBad) {
    console.log("Ocurrió un error al leer la memoria del PLC");
  }
  conn.writeItems("TEST4", false, valuesWritten);
  doneWriting = true;
  if (doneReading) {
    conn.connectionCleanup();
  };
};

/*function valuesReady(anythingBad, values) {
  if (anythingBad) { console.log("SOMETHING WENT WRONG READING VALUES!!!!"); }
  mts_reales_plc = values.TEST1
  //Una vez leido el bloque de memoria, retornar el valor correspondiente a los metros de tela utilizados.
  doneReading = true;
  if (doneWriting) {process.exit();}
  return mts_reales_plc/
};*/

//Funcionalidades para la actual estación 1010, donde solo se realizara el conteo de capas encimadas

//Testear función con la conexion al plc

export async function layers_count(anythingBad){
  conn.initiateConnection(
    { port: 102, host: ip, rack: 0, slot: 1, debug: false },
    (err) => {
      if (typeof err !== "undefined") {
        console.log(err);
        status_plc = true;
      }else{
        status_plc = false;
      }
      conn.setTranslationCB(function (tag) {
        return variables[tag];
      }); // This sets the "translation" to allow us to work with object names
      conn.addItems(["TEST8"]);
      conn.addItems(["TEST9"]);
      conn.readAllItems((err, values) => {
        if (err) {
          console.log("Ocurrió un error al leer la memoria del PLC");
        };
        layer_counter = values.TEST8
        finished_layers = values.TEST9
        console.log("Cantidad de capas contadas:", layer_counter, "Estado:", finished_layers)
        conn.connectionCleanup();
    });
  });
};

//setInterval(connectToPulse, 5000)
