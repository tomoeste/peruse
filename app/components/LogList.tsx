import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { selectLogLines } from '../features/logReader/logReaderSlice';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { LogLine } from './LogLine';

export const LogList = (props: any) => {
  const logLines = useSelector(selectLogLines);
  const listRef = React.createRef<FixedSizeList>();
  const { height, width } = useWindowDimensions();
  const { search, followMode, liveMode } = props;

  useEffect(() => {
    if (followMode && logLines && logLines.length > 0) {
      listRef.current?.scrollToItem(logLines.length, 'end');
    }
  }, [listRef, logLines, followMode]);

  return (
    <FixedSizeList
      ref={listRef}
      height={height - 20}
      itemData={logLines}
      width="100%"
      itemCount={logLines.length}
      itemSize={30}
    >
      {(itemProps: any) => <LogLine itemProps={itemProps} search={search} />}
    </FixedSizeList>
  );
};

export default LogList;
