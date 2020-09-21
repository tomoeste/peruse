/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Field, Form, Formik, useField, useFormikContext } from 'formik';
import { debounce } from 'lodash';
import * as settings from 'electron-settings';
import React, { useEffect } from 'react';
import styles from './Home.css';

const TextInput = (props: any) => {
  const [field, meta] = useField(props);
  const { id, label, helpText } = props;

  return (
    <div
      className={`${styles.formField} ${
        meta.error ? styles.invalid : styles.valid
      }`}
    >
      <label htmlFor={id}>{label}</label>
      <div className={styles.textXs} id={`${id}-help`} tabIndex={-1}>
        {helpText}
      </div>
      <input {...props} {...field} aria-describedby={`${id}-help`} />
    </div>
  );
};

const AutoSave = ({ debounceMs }: any) => {
  const formik = useFormikContext();
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);
  const debouncedSubmit = React.useCallback(
    debounce(
      () =>
        formik.submitForm().then(() => setLastSaved(new Date().toISOString())),
      debounceMs
    ),
    [debounceMs, formik.submitForm]
  );

  React.useEffect(() => {
    debouncedSubmit();
  }, [debouncedSubmit, formik.values]);

  return <>{formik.isSubmitting ? 'saving...' : null}</>;
};

export const Settings = (props: any) => {
  useEffect(() => {}, []);

  return (
    <div className={styles.detailPane}>
      <div className={styles.detailHeader}>SETTINGS</div>
      <div className={styles.form}>
        <Formik
          initialValues={settings.getSync()}
          onSubmit={(values, { setSubmitting }) => {
            settings.setSync(values);
            setSubmitting(false);
          }}
        >
          <Form>
            <AutoSave debounceMs={300} />
            <TextInput
              id="maxLineLength"
              name="maxLineLength"
              label="Maximum line length"
              helpText="Controls when to prompt before loading log line details"
              type="number"
            />
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Settings;
