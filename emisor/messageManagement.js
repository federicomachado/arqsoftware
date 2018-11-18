
  var arrMessages = [];
  arrMessages['EXPIRED_CARD'] = {message: "Tarjeta Vencida", codeMessage:"EXPIRED_CARD", error: true};
  arrMessages['INSUFFICIENT_AMOUNT'] = {message: "El saldo de la cuenta del titular no es suficiente para el monto a aprobar.", codeMessage:"INSUFFICIENT_AMOUNT", error: true};
  arrMessages['CREDITCARD_BLOCKED'] = {message: "Tarjeta bloqueada", codeMessage:"CREDITCARD_BLOCKED", error: true};
  arrMessages['DATABASE_ERROR'] = {message: "Error al guardar en la BD", codeMessage:"DATABASE_ERROR", error: true};
  arrMessages['TRANSACTION_CREATED'] = {message: "Transaccion creada correctamente", codeMessage:"TRANSACTION_CREATED", error: false};
  

  module.exports = arrMessages;