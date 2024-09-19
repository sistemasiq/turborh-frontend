import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useRequestUser = defineStore("requestUser", () => {

  const frontPageData = ref({
    name: "",
    firstLastName: "",
    secondLastName: "",
    wantedSalary: 0,
    gender: "",
    photo: "",
  });

  const personalData = ref({
    homeAddress: "",
    colony: "",
    zipcode: "",
    state: "",
    city: "",
    birthPlace: "",
    birthDate: "",
    phone: "",
    email: "",
    height: 0,
    weight: 0,
    civilStatus: "",
    homeProperty: "",
    bloodType: "",
    roomie: "",
    dependents: "",
    kinship: "",
    amount: 0,
    clubs: "",
    goalInLife: "",
    diseases: "",
    allergies: "",
    brand: "",
    incomesConcept: 0,
    isCheckedDiseases: false,
    isCheckedAllergies: false,
    isCheckedCar: false,
    isCheckedIncome: false,
  });

  const documentsData = ref({
    rfc: "",
    imss: "",
    afore: "",
    fm2: "",
    curriculumUUID: ""
  });

  const curriculumStored = ref();

  const drivingLicenceData = ref([]);

  const recruitingMeansData = ref({
    medium: "",
    relative: "",
    department: "",
    sindicate: "",
    isCheckedFamiliar: false,
    isCheckedDepartment: false,
  });

  const familyReferencesData = ref([]);
  const commercialReferencesData = ref([]);

  const familyFathersData = ref([
    {
      relationship: "",
      name: "",
      birthdate: "",
      job: "",
      jobAddress: "",
    },
    {
      relationship: "",
      name: "",
      birthdate: "",
      job: "",
      jobAddress: "",
    },
  ]);
  const familySonsData = ref([]);

  const educationData = ref({
    secondary: "",
    highSchool: "",
    master: "",
    other: "",
    professional: "",
    speciality: "",
    languages: "",
    schedules: "",
    secondarySpeciality: "",
    highSchoolSpeciality: "",
    professionalSpeciality: "",
    masterSpeciality: "",
    otherSpeciality: "",
    currentInstitution: "",
    currentSpeciality: "",
    dateStartSecondary: "",
    dateEndSecondary: "",
    dateStartHighSchool: "",
    dateEndHighSchool: "",
    dateStartProfessional: "",
    dateEndProfessional: "",
    dateStartMaster: "",
    dateEndMaster: "",
    dateStartOther: "",
    dateEndOther: "",
    isPublicSecondary: false,
    isPublicHighSchool: false,
    isPublicProfessional: false,
    isPublicMaster: false,
    isPublicOther: false,
    isPublicCurrent: false,
    certifiedSecondary: false,
    notCertifiedSecondary: false,
    certifiedHighSchool: false,
    notCertifiedHighSchool: false,
    certifiedProfessional: false,
    notCertifiedProfessional: false,
    certifiedMaster: false,
    notCertifiedMaster: false,
    certifiedOther: false,
    notCertifiedOther: false,
    currentlyStudying: false,
    currentlyNotStudying: false,
    selectedProfesional: "",
    professionalLicence: null,
  });

  const machineryData = ref([]);
  const toolsData = ref([]);
  const measuringInstrumentsData = ref([]);
  const otherToolsData = ref([]);


  const machinery = computed(() =>
    machineryData.value.concat(
      toolsData.value,
      measuringInstrumentsData.value,
      otherToolsData.value
    )
  );

  const clearMachinery = () => {

    machineryData.value = []
    toolsData.value = []
    measuringInstrumentsData.value = []
    otherToolsData.value = []
  }

  const officesData = ref([]);

  const laboralExperienceData = ref([
    {
      company: "",
      address: "",
      job: "",
      phone: "",
      lastBossName: "",
      lastBossPosition: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      startingPosition: "",
      endingPosition: "",
      startMontlySalary: "",
      endingMontlySalary: "",
      functionsPerformed: "",
      separationCause: "",
      inmediateLastBossName: "",
      inmediateLastBossPosition: "",
    },
  ]);

  const savedApplication = ref();



  const userHasApplication = computed(() => {
    if(savedApplication.value){
      return savedApplication.value.solicitud_id !== 0 && savedApplication.value.solicitud_id !== undefined;
    }else{
      return false;
    }
  })

  const fullName = computed(() => {
    return savedApplication.value.nombre +" "+ savedApplication.value.apellido_paterno +" "+ savedApplication.value.apellido_materno;
  })

  const viewingApplication = ref(false);
  const updatingApplication = ref(false);



  return {
    frontPageData,
    personalData,
    documentsData,
    drivingLicenceData,
    recruitingMeansData,
    familyReferencesData,
    commercialReferencesData,
    familyFathersData,
    familySonsData,
    educationData,
    machineryData,
    toolsData,
    measuringInstrumentsData,
    otherToolsData,
    officesData,
    laboralExperienceData,
    machinery,
    savedApplication,
    viewingApplication,
    updatingApplication,
    fullName,
    userHasApplication,
    curriculumStored,
    clearMachinery
  };
});
