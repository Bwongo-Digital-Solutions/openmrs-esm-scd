import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@openmrs/esm-framework';
import { useSCDConsultationEncounters } from './scd-consultation-encounters.resource';
import { Config } from '../config-schema';
import styles from './scd-consultation-encounters.scss';

interface SCDConsultationEncountersProps {
  patientUuid: string;
}

const SCDConsultationEncounters: React.FC<SCDConsultationEncountersProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<Config>();
  const { encounters, isLoading, error } = useSCDConsultationEncounters(
    patientUuid,
    config.scdFormUuid,
    config.consultationEncounterTypeUuid,
  );

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h4 className={styles.heading}>{t('scdConsultationEncounters', 'SCD Consultation Encounters')}</h4>
        <p>{t('loading', 'Loading...')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h4 className={styles.heading}>{t('scdConsultationEncounters', 'SCD Consultation Encounters')}</h4>
        <p className={styles.error}>{t('errorLoadingEncounters', 'Error loading encounters')}</p>
      </div>
    );
  }

  if (!encounters || encounters.length === 0) {
    return (
      <div className={styles.container}>
        <h4 className={styles.heading}>{t('scdConsultationEncounters', 'SCD Consultation Encounters')}</h4>
        <p className={styles.emptyState}>{t('noEncountersFound', 'No SCD consultation encounters found')}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.heading}>{t('scdConsultationEncounters', 'SCD Consultation Encounters')}</h4>
      <div className={styles.encountersList}>
        {encounters.map((encounter) => (
          <div key={encounter.uuid} className={styles.encounterCard}>
            <div className={styles.encounterHeader}>
              <span className={styles.encounterDate}>{new Date(encounter.encounterDatetime).toLocaleDateString()}</span>
              <span className={styles.encounterType}>{encounter.encounterType?.display}</span>
            </div>
            {encounter.location && (
              <div className={styles.encounterLocation}>
                <strong>{t('location', 'Location')}:</strong> {encounter.location.display}
              </div>
            )}
            {encounter.encounterProviders && encounter.encounterProviders.length > 0 && (
              <div className={styles.encounterProviders}>
                <strong>{t('provider', 'Provider')}:</strong>{' '}
                {encounter.encounterProviders.map((ep) => ep.provider?.display).join(', ')}
              </div>
            )}
            {encounter.obs && encounter.obs.length > 0 && (
              <div className={styles.encounterObs}>
                <strong>{t('observations', 'Observations')}:</strong> {encounter.obs.length}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SCDConsultationEncounters;
