import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { get } from 'lodash';
import { selectActiveTab } from '../features/logReader/logReaderSlice';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { LogLine } from './LogLine';

export const LogList = () => {
  const activeTab = useSelector(selectActiveTab);
  const listRef = React.createRef<FixedSizeList>();
  const { height } = useWindowDimensions();

  useEffect(() => {
    if (
      activeTab?.followMode &&
      activeTab?.content &&
      activeTab?.content.length > 0
    ) {
      listRef.current?.scrollToItem(activeTab?.content.length, 'end');
    }
  }, [listRef, activeTab?.followMode, activeTab?.content]);

  return (
    <FixedSizeList
      ref={listRef}
      height={height - 70}
      itemData={get(activeTab, `content`, [])}
      width="100%"
      itemCount={get(activeTab, `content.length`, 0)}
      itemSize={30}
    >
      {(itemProps: unknown) => <LogLine itemProps={itemProps} />}
    </FixedSizeList>
  );
};

export default LogList;
