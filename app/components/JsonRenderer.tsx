import React, { useMemo } from 'react';
import ReactJson from 'react-json-view';

export const JsonRenderer = (props: { json: string }) => {
  const { json } = props;

  return useMemo(() => {
    return (
      <ReactJson
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        src={JSON.parse(json)}
        name="line"
        theme="tomorrow"
        displayDataTypes={false}
        style={{ backgroundColor: `transparent`, padding: `0 20px` }}
      />
    );
  }, [json]);
};

export default JsonRenderer;
