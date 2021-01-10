import {Visit} from './entity/visit';
import {Prescription} from './entity/prescription';

export class XmlTemplates {
  static addVisitXMLTemplate(visit: Visit): string {
    return '' +
      '<ClinicalDocument\n' +
      '  xmlns="urn:hl7-org:v3"\n' +
      '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:hl7-org:v3 CDA.xsd">\n' +
      '  <recordTarget>\n' +
      '    <!-- Στοιχεία ασθενή -->\n' +
      '    <patientRole>\n' +
      '      <!-- ΑΜΚΑ ασθενή -->\n' +
      '      <!-- Σε περίπτωση ασθενή με ΕΚΑΑ, εδώ μπαίνει ο αριθμός ΕΚΑΑ-->\n' +
      '      <id root="1.10.1" extension="' +

      visit.patient.amka +

      '"/>\n' +
      '      <!-- Id Ασφαλιστικού Φορέα -->\n' +
      '      <!-- Σε περίπτωση ασθενή με ΕΚΑΑ, εδώ μπαίνει το Id του ' +
      '         ασφαλιστικού φορέα "Ευρωπαϊκή Κάρτα Ασφάλισης Ασθένειας" (extension="95") -->\n' +
      '      <id root="1.10.30.1.1" extension="' +

      visit.patient.activeInsurance[0].socialInsurance.id +

      '"/>\n' +
      '    </patientRole>\n' +
      '  </recordTarget>\n' +
      '  <!-- Πληροφορίες Γιατρού -->\n' +
      '  <author>\n' +
      '    <assignedAuthor>\n' +
      '      <!-- ΑΜΚΑ Γιατρού -->\n' +
      '      <id root="1.19" extension="' +

      visit.doctor.amka +

      '"/>\n' +
      '      <assignedPerson>\n' +
      '      </assignedPerson>\n' +
      '      <!-- Ιd Μονάδας Συνταγογράφησης -->\n' +
      '      <representedOrganization classCode="ORG" determinerCode="INSTANCE">\n' +
      '        <id root="1.80.1" extension="' +

      visit.unit.id +

      '"/>\n' +
      '      </representedOrganization>\n' +
      '    </assignedAuthor>\n' +
      '  </author>\n' +
      '  <!-- Βασικές Πληροφορίες Επίσκεψης -->\n' +
      '  <componentOf>\n' +
      '    <encompassingEncounter>\n' +
      '      <!-- Id Ασφαλιστικού Φορέα που χρησιμοποιήθηκε για την καταχώρηση της Επίσκεψης -->\n' +
      '      <!-- Σε περίπτωση ασθενή με ΕΚΑΑ, εδώ μπαίνει το Id του ' +
      '         ασφαλιστικού φορέα "Ευρωπαϊκή Κάρτα Ασφάλισης Ασθένειας" (extension="95") -->\n' +
      '      <id root="1.80.2" extension="' +

      visit.patient.activeInsurance[0].socialInsurance.id +

      '"/>\n' +
      '    </encompassingEncounter>\n' +
      '  </componentOf>\n' +
      '  <!-- Πληροφορίες Επίσκεψης -->\n' +
      '  <component>\n' +
      '    <structuredBody>\n' +
      '      <!-- Επίσκεψη -->\n' +
      '      <component>\n' +
      '        <section>\n' +
      '          <templateId root="2.16.840.1.113883.10.20.22.2.22"/>\n' +
      '          <entry>\n' +
      '            <encounter classCode="ENC" moodCode="EVN">\n' +
      '              <entryRelationship typeCode="RSON">\n' +
      '                <observation classCode="OBS" moodCode="EVN">\n' +
      '                  <code xsi:type="CE" code="29299-5" codeSystem="2.16.840.1.113883.6.1"\n' +
      '                        codeSystemName="LOINC"\n' +
      '                        displayName="Reason for visit"/>\n' +
      '                  <!-- Λόγος Επίσκεψης -->\n' +
      '                  <text>' +

      visit.reason +

      '</text>\n' +
      '                </observation>\n' +
      '              </entryRelationship>\n' +
      '              <entryRelationship typeCode="RSON">\n' +
      '                <observation classCode="OBS" moodCode="EVN">\n' +
      '                  <code xsi:type="CE" code="34109-9" codeSystem="2.16.840.1.113883.6.1"\n' +
      '                        codeSystemName="LOINC"\n' +
      '                        displayName="Note"/>\n' +
      '                  <!-- Σχόλια Επίσκεψης -->\n' +
      '                  <text>' +

      visit.comments +

      '</text>\n' +
      '                </observation>\n' +
      '              </entryRelationship>\n' +
      '              <entryRelationship typeCode="RSON">\n' +
      '                <act classCode="INFRM" moodCode="EVN">\n' +
      '                  <!-- Υπολογισμός στις Μηνιαίες επισκέψεις -->\n' +
      '                  <!-- 0: Not Included In Quota (να μην υπολογίζεται)-->\n' +
      '                  <!-- 1: Included In Quota (να υπολογίζεται)-->\n' +
      '                  <code code="0" codeSystem="2.2" codeSystemName="HKES"\n' +
      '                        displayName="Not Included in Quota"/>\n' +
      '                </act>\n' +
      '              </entryRelationship>\n' +
      '            </encounter>\n' +
      '          </entry>\n' +
      '        </section>\n' +
      '      </component>\n' +
      '    </structuredBody>\n' +
      '  </component>\n' +
      '</ClinicalDocument>\n' +
      '';
  }

  static editVisitXMLTemplate(visit: Visit): string {
    return '' +
      '<ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
      '                  xsi:schemaLocation="urn:hl7-org:v3 CDA.xsd">\n' +
      '  <recordTarget>\n' +
      '    <!-- στοιχεια ασθενη -->\n' +
      '    <patientRole>\n' +
      '      <!-- ΑΜΚΑ -->\n' +
      '      <id root="1.10.1" extension="' +

      visit.patient.amka +

      '"/>\n' +
      '      <!-- Id Ασφαλιστικού Φορέα -->\n' +
      '      <id root="1.10.30.1.1" extension="' +

      visit.patient.activeInsurance[0].socialInsurance.id +

      '"/>\n' +
      '    </patientRole>\n' +
      '  </recordTarget>\n' +
      '  <!-- Πληροφορίες Γιατρού -->\n' +
      '  <author>\n' +
      '    <assignedAuthor>\n' +
      '      <!-- ΑΜΚΑ Γιατρού -->\n' +
      '      <id root="1.19" extension="' +

      visit.doctor.amka +

      '"/>\n' +
      '    </assignedAuthor>\n' +
      '  </author>\n' +
      '  <!-- Πληροφορίες Επίσκεψης -->\n' +
      '  <component>\n' +
      '    <structuredBody>\n' +
      '      <!-- Επίσκεψη -->\n' +
      '      <component>\n' +
      '        <section>\n' +
      '          <templateId root="2.16.840.1.113883.10.20.22.2.22"/>\n' +
      '          <text/>\n' +
      '          <entry>\n' +
      '            <encounter classCode="ENC" moodCode="EVN">\n' +
      '              <entryRelationship typeCode="RSON">\n' +
      '                <observation classCode="OBS" moodCode="EVN">\n' +
      '                  <code xsi:type="CE" code="29299-5" codeSystem="2.16.840.1.113883.6.1"\n' +
      '                        codeSystemName="LOINC" displayName="Reason for visit"/>\n' +
      '                  <!-- Λόγος Επίσκεψης -->\n' +
      '                  <text>' +

      visit.reason +

      '</text>\n' +
      '                </observation>\n' +
      '              </entryRelationship>\n' +
      '              <entryRelationship typeCode="RSON">\n' +
      '                <observation classCode="OBS" moodCode="EVN">\n' +
      '                  <templateId root="1.3.6.1.4.1.19376.1.5.3.1.4.3.2"/>\n' +
      '                  <code xsi:type="CE" code="34109-9" codeSystem="2.16.840.1.113883.6.1"\n' +
      '                        codeSystemName="LOINC" displayName="Note"/>\n' +
      '                  <!-- Σχόλια Επίσκεψης -->\n' +
      '                  <text>' +

      visit.comments +

      '</text>\n' +
      '                </observation>\n' +
      '              </entryRelationship>\n' +
      '              <entryRelationship typeCode="RSON">\n' +
      '                <act classCode="INFRM" moodCode="EVN">\n' +
      '                  <!-- Υπολογισμός στις Μηνιαίες επισκέψεις -->\n' +
      '                  <!-- 0: Not Included In Quota (να μην υπολογίζεται)-->\n' +
      '                  <!-- 1: Included In Quota (να υπολογίζεται)-->\n' +
      '                  <code code="0" codeSystem="2.2" codeSystemName="HKES"\n' +
      '                        displayName="Not Included in Quota"/>\n' +
      '                </act>\n' +
      '              </entryRelationship>\n' +
      '            </encounter>\n' +
      '          </entry>\n' +
      '        </section>\n' +
      '      </component>\n' +
      '    </structuredBody>\n' +
      '  </component>\n' +
      '</ClinicalDocument>' +
      '';
  }

  static addOrEditPrescriptionXMLTemplate(prescription: Prescription): string {
    let finalAddOrEditPrescriptionXML = '' +
      '<ClinicalDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
      '                  xmlns="urn:hl7-org:v3">\n' +
      '  <!-- Το barcode της Συνταγής -->\n' +
      '  <id extension="' +

      prescription.id +

      '" root="1.21"/>\n' +
      '  <!-- Πληροφορίες Ασθενή -->\n' +
      '  <recordTarget contextControlCode="OP" typeCode="RCT">\n' +
      '    <patientRole>\n' +
      '      <!-- ΑΜΚΑ Ασθενή -->\n' +
      '      <id extension="' +

      prescription.patient.amka +

      '" root="1.10.1"/>\n' +
      '      <!-- Id Ασφαλιστικού Φορέα με βάση το οποίο έγινε η συνταγογράφηση -->\n' +
      '      <id extension="' +

      prescription.patient.activeInsurance[0].socialInsurance.id +

      '" root="1.10.30.1"/>\n' +
      '    </patientRole>\n' +
      '  </recordTarget>\n' +
      '  <!-- Πληροφορίες Γιατρού -->\n' +
      '  <author>\n' +
      '    <assignedAuthor>\n' +
      '      <!-- ΑΜΚΑ Γιατρού -->\n' +
      '      <id extension="' +

      prescription.doctor.amka +

      '" root="1.19"/>\n' +
      '    </assignedAuthor>\n' +
      '  </author>\n' +
      '  <componentOf>\n' +
      '    <encompassingEncounter>\n' +
      '      <!-- Id Επίσκεψης -->\n' +
      '      <id extension="' +

      prescription.visit.id +

      '" root="1.80"/>\n' +
      '    </encompassingEncounter>\n' +
      '  </componentOf>\n' +
      '  <!-- Πληροφορίες Συνταγής -->\n' +
      '  <component>\n' +
      '    <structuredBody>\n' +
      '      <!-- Συνταγή -->\n' +
      '      <component>\n' +
      '        <section>\n' +
      '          <text>\n' +
      '            <!-- Λίστα με αναφορές -->\n' +
      '            <list>\n' +
      '              <item ID="med_barcode_1">' +

      prescription.medicine.barcode +

      '</item>\n' +
      '            </list>\n' +
      '          </text>\n' +
      '          <entry>\n' +
      '            <act classCode="INFRM" moodCode="EVN">\n' +
      '              <!-- Τύπος Συνταγής 1:Τυπική | 2:Ελεύθερη -->\n' +
      '              <id extension="1" root="1.1.3"/>\n' +
      '              <!-- Έπαναληψιμότητα Συνταγής, 1:Απλή | 3: 3μηνη | 4: 4μηνη | 5: 5μηνη | 6: 6μηνη -->\n' +
      '              <id extension="' +

      prescription.info.repeatability.id +

      '" root="1.1.4"/>\n' +
      '              <!-- Συνταγογραφημένη με βάση εμπορική ονομασία φαρμάκου -->\n' +
      '              <id root="1.1.3.1" extension="' +

      prescription.isPrescribedByBrandNameMedicine +

      '"/>\n' +
      '              <!-- Id λόγου συνταγογράφησης με βάση την εμπορική ονομασία φαρμάκου -->\n';

    if (prescription.isPrescribedByBrandNameMedicine !== 0) {
      finalAddOrEditPrescriptionXML += '<id root="1.1.3.2" extension="' +

        prescription.info.reasonForBrandNamedMedicines.id +

        '"/>\n';
    }

    finalAddOrEditPrescriptionXML += '' +
      '              <!-- Μονοδοσιακό, 1:Ναι | 0:Όχι -->\n' +
      '              <id extension="1" root="1.4.11"/>\n' +
      '              <!-- Δικαιούχος ΕΚΑΣ, 1:Ναι | 0:Όχι -->\n' +
      '              <id extension="0" root="1.10.4"/>\n' +
      '              <!-- Χρόνια Ασθένεια, 1:Ναι | 0:Όχι -->\n' +
      '              <id extension="' +

      prescription.isChronicIllness +

      '" root="1.10.9"/>\n' +
      '              <!-- Μηνιαία Συνταγή, 1:Ναι | 0:Όχι -->\n' +
      '              <id extension="' +

      prescription.isMonthlyPrescription +

      '" root="1.4.9"/>\n' +
      '              <!-- Δίμηνη Συνταγή, 1:Ναι | 0:Όχι -->\n' +
      '              <id extension="' +

      prescription.isTwoMonthsPrescription +

      '" root="1.4.10"/>\n' +
      '              <effectiveTime>\n' +
      '                <!-- Ημερομηνία έκδοσης Συνταγής -->\n' +
      '                <low value="' +

      prescription.createdDate +

      '"/>\n' +
      '                <!-- Ημερομηνία ακύρωσης/εκτέλεσης Συνταγής -->\n' +
      '                <high value="' +

      prescription.cancelledDate +

      '"/>\n' +
      '              </effectiveTime>\n' +
      '              <entryRelationship typeCode="RSON">\n' +
      '                <observation classCode="OBS" moodCode="EVN">\n' +
      '                  <!-- Το χειρόγραφο σχόλιο του γιατρού -->\n' +
      '                  <text>' +

      prescription.comments +

      '</text>\n' +
      '                  <value xsi:type="CD" code="' +

      prescription.icd10.code +

      '" codeSystem="1.3.6.1.4.1.12559.11.10.1.3.1.44.2"\n' +
      '                         codeSystemName="ICD10" displayName="' +

      prescription.icd10.diagnosis +

      '"/>\n' +
      '                </observation>\n' +
      '              </entryRelationship>\n' +
      '            </act>\n' +
      '          </entry>\n' +
      '          <!-- Γραμμές Συνταγής -->\n' +
      '          <!-- Γραμμή Συνταγής 1 -->\n' +
      '          <entry>\n' +
      '            <substanceAdministration classCode="SBADM" moodCode="INT">\n' +
      '              <!-- Το barcode της γραμμής -->\n' +
      '              <id extension="0" root="1.21.1"/>\n' +
      '              <!-- Έναρξη/Λήξη θεραπείας, Δεν χρησιμοποιείται προς το παρών. Πάντα UNK -->\n' +
      '              <effectiveTime xsi:type="IVL_TS">\n' +
      '                <low nullFlavor="UNK"/>\n' +
      '                <high nullFlavor="UNK"/>\n' +
      '              </effectiveTime>\n' +
      '              <!-- Συχνότητα Συνταγής -->\n' +
      '              <effectiveTime xsi:type="PIVL_TS" operator="A">\n' +
      '                <period value="1" unit="d"/>\n' +
      '              </effectiveTime>\n' +
      '              <!-- Ποσότητα δόσης -->\n' +
      '              <doseQuantity>\n' +
      '                <low value="' +

      prescription.medicine.dailyDose +

      '" unit="' +

      prescription.medicine.doseUnit +

      '"/>\n' +
      '                <high value="' +

      prescription.medicine.dailyDose +

      '" unit="' +

      prescription.medicine.doseUnit +

      '"/>\n' +
      '              </doseQuantity>\n' +
      '              <!-- Διάρκεια λήψης του φαρμάκου -->\n' +
      '              <rateQuantity>\n' +
      '                <low value="' +

      prescription.medicine.treatmentDuration +

      '" unit="d"/>\n' +
      '                <high value="' +

      prescription.medicine.treatmentDuration +

      '" unit="d"/>\n' +
      '              </rateQuantity>\n' +
      '              <!-- Πληροφορίες Φαρμάκου -->\n' +
      '              <consumable>\n' +
      '                <manufacturedProduct classCode="MANU">\n' +
      '                  <manufacturedMaterial>\n' +
      '                    <!-- Φάρμακο, code: EOFcode φαρμάκου, displayName: Ονομασία φαρμάκου -->\n' +
      '                    <code code="' +

      prescription.medicine.code +

      '" codeSystem="0.0.0.0.0.0.0.0.0" codeSystemName="EOF"\n' +
      '                          displayName="' +

      prescription.medicine.name +

      '">\n' +
      '                      <originalText>\n' +
      '                        <!-- To barcode του φαρμάκου, είναι τιμή αναφοράς σε γραμμή που συμπεριλαμβάνει -->\n' +
      '                        <!-- την τιμή του πεδίου "#med_barcode_1" -->\n' +
      '                        <reference value="#med_barcode_1"/>\n' +
      '                      </originalText>\n' +
      '                    </code>\n' +
      '                  </manufacturedMaterial>\n' +
      '                </manufacturedProduct>\n' +
      '              </consumable>\n' +
      '              <entryRelationship typeCode="COMP">\n' +
      '                <!-- Ποσότητα που συνταγογραφήθηκε -->\n' +
      '                <supply classCode="SPLY" moodCode="RQO">\n' +
      '                  <quantity value="1" unit="1"/>\n' +
      '                </supply>\n' +
      '              </entryRelationship>\n' +
      '              <entryRelationship typeCode="SPRT">\n' +
      '                <act classCode="ACT" moodCode="EVN">\n' +
      '                  <templateId root="2.16.840.1.113883.10.12.301"/>\n' +
      '                  <!-- Ποσοστό συμμετοχής ασφαλισμένου -->\n' +
      '                  <id extension="' +

      prescription.patientParticipationPercentage +

      '" root="1.4.18"/>\n' +
      '                  <!-- Id Ασθένειας -->\n' +
      '                  <id extension="' +

      prescription.disease.id +

      '" root="1.4.23"/>\n' +
      '                </act>\n' +
      '              </entryRelationship>\n' +
      '              <!-- Συσχέτιση θεραπείας (φαρμάκου) - Icd10 διαγνώσεων -->\n' +
      '              <entryRelationship typeCode="REFR">\n' +
      '                <act classCode="INFRM" moodCode="EVN">\n' +
      '                  <entryRelationship typeCode="RSON">\n' +
      '                    <observation classCode="OBS" moodCode="EVN">\n' +
      '                      <!-- Κωδικός και Τίτλος ICD10 -->\n' +
      '                      <value xsi:type="CD" code="' +

      prescription.icd10.code +

      '" codeSystem="1.3.6.1.4.1.12559.11.10.1.3.1.44.2"\n' +
      '                             codeSystemName="ICD10" displayName="' +

      prescription.icd10.diagnosis +

      '"/>\n' +
      '                    </observation>\n' +
      '                  </entryRelationship>\n' +
      '                </act>\n' +
      '              </entryRelationship>\n' +
      '            </substanceAdministration>\n' +
      '          </entry>\n' +
      '        </section>\n' +
      '      </component>\n' +
      '    </structuredBody>\n' +
      '  </component>\n' +
      '</ClinicalDocument>\n';

    return finalAddOrEditPrescriptionXML;
  }
}
