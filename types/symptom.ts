export type Symptom = {
  id: string;
  bodyPartId: string;
  slug: string;
  name: string;
  description: string;
};

export type SymptomResult = {
  symptomId: string;
  departments: string[];
  seeDoctorSoon: string;
  emergency: string;
};
