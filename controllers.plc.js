import nodes7 from "nodes7";
var conn = new nodes7();
var doneReading = false;
var doneWriting = false;
let test_final = 0;

var variables = {
  TEST1: "DB20,R2", // Mts de tela PLC (lectura) - db20.dbd2 DB20,DI2 -- Memory real at MD4
  TEST2: "DB21,X0.0", // HeartBeat bit
  TEST3: "BD21,X0.1", // Comenzar a contar
  TEST4: "DB21,X0.2", // Reset contador de mts (db21.dbx0.2)
  TEST5: "DB20,X0.0", //
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
    { port: 102, host: "192.168.0.1", rack: 0, slot: 1, debug: false },
    (err) => {
      if (typeof err !== "undefined") {
        console.log(err);
        process.exit();
      }
      conn.setTranslationCB(function (tag) {
        return variables[tag];
      }); // This sets the "translation" to allow us to work with object names
      conn.addItems(["TEST1"]);
      //conn.writeItems('TEST1', false, valuesWritten);
      let x;
      conn.readAllItems((err, values) => {
        if (err) {
          console.log("SOMETHING WENT WRONG READING VALUES!!!!");
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
          console.log("done Writing");
          //conn.connectionCleanup()
        }
        return test_final;
      });
    }
  );
}

export async function connectPLCtoRead() {
  conn.initiateConnection(
    { port: 102, host: "192.168.0.1", rack: 0, slot: 1, debug: false },
    (err) => {
      if (typeof err !== "undefined") {
        console.log(err);
        process.exit();
      }
      conn.setTranslationCB(function (tag) {
        return variables[tag];
      }); // This sets the "translation" to allow us to work with object names
      conn.addItems(["TEST1"]);
      //conn.writeItems('TEST1', false, valuesWritten);
      let x;
      conn.readAllItems((err, values) => {
        if (err) {
          console.log("SOMETHING WENT WRONG READING VALUES!!!!");
        }
        mts_reales_plc = values.TEST1;

        async function metros() {
          let mt;
          if (mts_reales_plc != 0) {
            mt = mts_reales_plc;
            //console.log ("Test dentro de funcion metros()", test_final)
          }
          console.log("nuevo test funcion metros():", mt);
          conn.writeItems("TEST4", true, valuesWritten);
          return mt;
        }
        test_final = metros();
        console.log("test valor", test_final);
        doneReading = true;
        if (doneWriting) {
          console.log("done Writing");
          //conn.connectionCleanup()
        }
        return test_final;
      });
    }
  );
}

//Escritura en 0 si es necesario
function valuesWritten(anythingBad) {
  if (anythingBad) {
    console.log("SOMETHING WENT WRONG WRITING VALUES!!!!");
  }
  conn.writeItems("TEST4", false, valuesWritten);

  console.log("Done writing. values MARCA");
  doneWriting = true;
  if (doneReading) {
    conn.connectionCleanup();
  }
}

/*function valuesReady(anythingBad, values) {
  if (anythingBad) { console.log("SOMETHING WENT WRONG READING VALUES!!!!"); }
  mts_reales_plc = values.TEST1
  //Una vez leido el bloque de memoria, retornar el valor correspondiente a los metros de tela utilizados.
  doneReading = true;
  if (doneWriting) {process.exit();}
  return mts_reales_plc
};*/
