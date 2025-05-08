interface SpokiConfiguration {
	confermaAppuntamentoId: string;
	confermaAppuntamentoSecret: string;
	confermaAppuntamentoVenditaId: string;
	confermaAppuntamentoVenditaSecret: string;
	presentazioneId: string;
	presentazioneSecret: string;
	registrazioneId: string;
	registrazioneSecret: string;
}

interface Agency {
    adsAutoscoutMaxNumber: number;
    adsAutosupermarketMaxNumber: number;
    adsSubitoMaxNumber: number;
    agenziaPrincipale: any;
    cap: string;
    citta: string;
    code: string;
    codiceFiscale: string;
    compensoVoltura: number;
    denominazione: string;
    description: string;
    email: string;
    id: string;
    indirizzo: string;
    isEnabled: boolean;
    isFatturazione: boolean;
    isFranchisor: boolean;
    isVisiblePublic: boolean;
    partitaIva: string;
    provincia: string;
    regimeDelMargineInitDate: string;
    regimeDelMargineInitValue: number;
    regimeFiscale: string;
    sitoweb: string;
    spokiConfiguration: SpokiConfiguration;
    telefono: string;
    telefonoSpoki: string;
}

export default Agency
  
