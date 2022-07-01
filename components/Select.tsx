type SelectProps = {
  list: any;
  name: string;
  setSelected?: any;
  selected?: string;
};

type SelectItemProps = {
  name: string;
  id: string;
  value: string;
};

export function Select({ list, name, setSelected }: SelectProps) {
  const handleChange = (event: any) => {
    setSelected(event.target.value);
  };

  return (
    <div className="col-span-6 sm:col-span-3">
      <select
        onChange={name === 'access' ? handleChange : undefined}
        name={name}
        className="bg-white w-full border border-slate-300 rounded-md py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
      >
        {/* //name="option" */}
        {list.map((item: SelectItemProps) => (
          <option key={item.id} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
