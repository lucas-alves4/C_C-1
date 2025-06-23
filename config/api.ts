// ===================================================================
// ARQUIVO DE CONFIGURAÇÃO CENTRAL DA API
// ===================================================================
//
// O endereço IP abaixo foi configurado com o que você forneceu.
// Lembre-se que seu celular Android e seu computador PRECISAM 
// estar conectados na mesma rede Wi-Fi.

const IP_ADDRESS = '192.168.100.143'; // SEU IP AQUI!

// Dica para emulador Android: você também pode tentar usar '10.0.2.2'
// const IP_ADDRESS = '10.0.2.2';

export const API_URL = `http://${IP_ADDRESS}:3000/api`;