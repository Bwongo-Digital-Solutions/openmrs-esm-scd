import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

interface EncounterProvider {
  uuid: string;
  provider?: {
    uuid: string;
    display: string;
  };
}

interface Observation {
  uuid: string;
  concept: {
    uuid: string;
    display: string;
  };
  value: any;
  display: string;
}

export interface Encounter {
  uuid: string;
  encounterDatetime: string;
  encounterType: {
    uuid: string;
    display: string;
  };
  location?: {
    uuid: string;
    display: string;
  };
  encounterProviders?: EncounterProvider[];
  obs?: Observation[];
  form?: {
    uuid: string;
    display: string;
  };
}

interface EncounterResponse {
  results: Encounter[];
}

export function useSCDConsultationEncounters(
  patientUuid: string,
  scdFormUuid: string,
  consultationEncounterTypeUuid: string,
) {
  const customRepresentation =
    'custom:(uuid,encounterDatetime,encounterType:(uuid,display),' +
    'location:(uuid,display),encounterProviders:(uuid,provider:(uuid,display)),' +
    'obs:(uuid,concept:(uuid,display),value,display),form:(uuid,display))';

  let url = `${restBaseUrl}/encounter?patient=${patientUuid}&v=${customRepresentation}`;

  if (consultationEncounterTypeUuid) {
    url += `&encounterType=${consultationEncounterTypeUuid}`;
  }

  const { data, error, isLoading } = useSWR<{ data: EncounterResponse }, Error>(patientUuid ? url : null, openmrsFetch);

  const encounters =
    data?.data?.results?.filter((encounter) => {
      if (!scdFormUuid) {
        return true;
      }
      return encounter.form?.uuid === scdFormUuid;
    }) || [];

  const sortedEncounters = encounters.sort(
    (a, b) => new Date(b.encounterDatetime).getTime() - new Date(a.encounterDatetime).getTime(),
  );

  return {
    encounters: sortedEncounters,
    isLoading,
    error,
  };
}
