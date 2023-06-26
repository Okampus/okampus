import { useTypedLazyQuery } from '@okampus/shared/graphql';
import { useLazyEffect } from '@okampus/ui/hooks';
import { CollapsibleItem } from '@okampus/ui/molecules';
// import { DateInput, RadioInput, SearchInput, SingleFileInput, TextInput } from '@okampus/ui/molecules';
import { useState } from 'react';

import type { SelectItem } from '@okampus/shared/types';

export const WIP = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [value, setValue] = useState<SelectItem<string> | null>(null);
  // const [fileId, setFileId] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  // const [nameQuery, setNameQuery] = useState<string>('');
  // const [textValue, setTextValue] = useState<string>('');
  // const [selected, setSelected] = useState<number>(0);
  // const [selectedMulti, setSelectedMulti] = useState<boolean[]>([]);
  // const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [search, { data }] = useTypedLazyQuery({
    searchLocation: [{ query }, { id: true, street: true, coordinates: { latitude: true, longitude: true } }],
  });

  useLazyEffect(
    () => {
      if (query) search();
    },
    [query, search],
    2000
  );

  // const [searchCompany, { data: companyData }] = useTypedLazyQuery({
  //   searchFrenchCompany: [
  //     { query: { name: nameQuery } },
  //     {
  //       nationalId: true,
  //       name: true,
  //       activity: true,
  //       type: true,
  //       address: {
  //         streetNumber: true,
  //         streetType: true,
  //         streetName: true,
  //         cityCode: true,
  //         city: true,
  //       },
  //     },
  //   ],
  // });

  // const [processReceipt, { data: processedJson }] = useTypedLazyQuery({
  //   processReceipt: [{ key: fileId }, true],
  // });

  // useEffect(() => {
  //   query &&
  //     search({
  //       variables: { query },
  //       fetchPolicy: 'network-only',
  //       onCompleted: (data) => console.log('complete', data),
  //     });
  // }, [query, search]);

  // useEffect(() => {
  //   nameQuery &&
  //     searchCompany({
  //       variables: { query: { name: nameQuery } },
  //       fetchPolicy: 'network-only',
  //       onCompleted: (data) => console.log('complete', data),
  //     });
  // }, [nameQuery, searchCompany]);

  // useEffect(() => {
  //   console.log('FileId', fileId);
  //   fileId &&
  //     processReceipt({
  //       variables: { key: fileId },
  //       fetchPolicy: 'network-only',
  //       onCompleted: (data) => console.log('complete', data),
  //     });
  // }, [fileId, processReceipt]);

  return (
    <div className="text-0">
      <CollapsibleItem title="WIP" open={isOpen} onToggle={setIsOpen} content={<div>Test</div>} />
      {JSON.stringify(value)}
      {/* <input type="text" value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} /> */}
      {/* <div className="text-0">{JSON.stringify(companyData?.searchFrenchCompany)}</div> */}
      {/* <DateInput
        date={selectedDate}
        onChange={setSelectedDate}
        options={{ label: 'Tanggal Lahir', name: 'tanggal_lahir' }}
      />
      <SingleFileInput onChange={setValue} options={{ name: 'file', label: 'Fichier' }} />
      <TextInput
        value={textValue}
        onChange={setTextValue}
        options={{ name: 'test', label: 'Nom du fichier uploadé' }}
      />
      <RadioInput
        items={[
          { label: 'Pria', value: 'pria' },
          { label: 'Wanita', value: 'wanita' },
        ]}
        selected={selected}
        onChange={(value) => setSelected(value)}
        options={{ label: 'Jenis Kelamin', name: 'jenis_kelamin' }}
      /> */}
      {/* <DocumentInput onChange={(file) => setFileId(file || '')} /> */}
      {/* <div className="text-0">{processedJson?.processReceipt}</div> */}
      {/* <SearchInput
        options={{ label: 'Location', name: 'location' }}
        items={(data?.searchLocation ?? []).map((item) => ({ label: item.street, value: item.id || '' }))}
        value={value}
        onChangeValue={setValue}
        query={query}
        onChangeQuery={setQuery}
      /> */}
      {/* <MultiCheckboxInput
        items={[
          { label: 'Pria', value: 'pria' },
          { label: 'Wanita', value: 'wanita' },
        ]}
        selected={selectedMulti}
        onChange={setSelectedMulti}
        options={{ label: 'Jenis Kelamin', name: 'jenis_kelamin' }}
      /> */}
      {/* <div className="text-0">{JSON.stringify(selectedDate)}</div> */}
      {/* <input type="date" /> */}
      {/* <DateInput
        date={selectedDate}
        onChange={setSelectedDate}
        options={{ label: 'Tanggal Lahir', name: 'tanggal_lahir' }}
      /> */}
      {/* <CalendarDateInput date={selectedDate} setDate={setSelectedDate} /> */}
    </div>
  );
};
