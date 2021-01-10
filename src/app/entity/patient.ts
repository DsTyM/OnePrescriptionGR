export class Patient {
  'firstName': unknown;
  'lastName': unknown;
  'amka': unknown;
  'sex': {
    'id': unknown,
    'name': unknown
  };
  'birthDate': unknown | any;
  'address': unknown;
  'postalCode': unknown;
  'city': unknown;
  'county': unknown;
  'telephone': unknown;
  'email': unknown;
  'showInfo': unknown;
  'info': unknown;
  'greekCitizen': unknown;
  'country': {
    'Id': unknown,
    'name': unknown,
    'nameInEnglish': unknown,
    'code': unknown,
    'codeNum': unknown
  };
  'euPpa': unknown;
  'euInsurance': unknown;
  'euRegistryNo': unknown;
  'euCardExpiration': unknown;
  'euCardStartDate': unknown;
  'activeInsurance': [
    {
      'id': unknown,
      'socialInsurance': {
        'id': unknown,
        'name': unknown,
        'shortName': unknown,
        'active': unknown,
        'maxPrescriptionNo': unknown,
        'Code': 'unknown',
        'maxVisitNo': unknown,
        'Eopyy': unknown,
        'parentSocialInsuranceId': unknown,
        'canPrescribeExam': unknown,
        'noInn': unknown,
        'canExecuteExam': unknown,
        'treatmentProtocolCompliance': unknown,
        'prescribedOnlyAtHospital': unknown,
        'executedOnlyAtHospital': unknown,
        'spcFilterCompiance': unknown,
        'forEuPatient': unknown,
        'isPronoia': unknown,
        'participationPercentLov': unknown,
        'isN4368': unknown,
        'limitedExecution': unknown,
        'spcFilterCheckQuantity': unknown,
        'patientInfoMsg': unknown,
        'noInnLimitIncluded': unknown,
        'noInnMandatory': unknown,
        'retailPriceDispense': unknown,
        'ekasEnabled': unknown,
        'canPrescribeConsumable': unknown,
        'retiredEnabled': unknown,
        'isMilitary': unknown
      },
      'memberType': {
        'id': unknown,
        'name': unknown
      },
      'ama': unknown,
      'updateDate': unknown,
      'directlyInsuredAmka': unknown,
      'fromEmaes': unknown,
      'lastActive': unknown,
      'startDate': unknown,
      'expiryDate': unknown,
      'isRetired': unknown
    }
  ];
  'lastPrescriptionDate': unknown;
  'myLastVisitDate': unknown;
  'patientPartExceptions': [];
  'message': unknown;
}
