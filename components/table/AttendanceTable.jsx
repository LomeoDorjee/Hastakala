"use client"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Input, Button } from "@nextui-org/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { fetchDeviceLog } from "@/lib/actions/pis/attendance.actions"
import { formatDateToTime } from "@/lib/utils"
import { SearchIcon } from "@/components/icons/icons"

export default function AttendanceTable() {

    const today = new Date().toISOString().split('T')[0]
  
    const [logs, setLogs] = useState([]);
    
    async function fetchLogs(date) {
        setLogs(await fetchDeviceLog(date))
    }
  
    useEffect(() => {
        fetchLogs(today)
    },[]);


    // Filtering    
    const onSearchChange = useCallback((value) => {
        if (value) {
          setFilterValue(value);
          setPage(1);
        } else {
          setFilterValue("");
        }
    }, []);

    const [filterValue, setFilterValue] = useState('');

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredData = [...logs];
        if (hasSearchFilter) {
            filteredData = filteredData.filter((log) =>
                log.STAFF.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
    
        return filteredData;
    }, [logs, filterValue]);

    // Fetch Data
    const [filterDate, setFilterDate] = useState(today);

    const onDateChange = useCallback((e) => {
        if (e.target.value) {
            console.log(e.target.value)
            setFilterDate(new Date(e.target.value).toISOString().split('T')[0])
            fetchLogs(e.target.value)
        }
    }, []);
    
    // Pagination
    const [page, setPage] = useState(1);
    const rowsPerPage = 9;

    const pages = Math.ceil(filteredItems.length / rowsPerPage);
   
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems]);

    const onNextPage = useCallback(() => {
        if (page < pages) {
          setPage(page + 1);
        }
    }, [page, pages]);
    
    const onPreviousPage = useCallback(() => {
        if (page > 1) {
          setPage(page - 1);
        }
    }, [page]);

    // Sorting
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "CODE",
        direction: "ascending",
    });

    const sortedLogs = useMemo(() => {
        return [...items].sort((a, b) => {
          const first = a[sortDescriptor.column];
          const second = b[sortDescriptor.column];
          const cmp = first < second ? -1 : first > second ? 1 : 0;
    
          return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);


    // Inputs
    const topContent = useMemo(() => {
        return (
            <div className="flex justify-between gap-4 items-center w-full">
                <Input
                    isClearable
                    // className="w-full sm:max-w-[49%]"
                    placeholder="Search by Staff Name..."
                    startContent={ <SearchIcon /> }
                    value={filterValue}
                    // onClear={() => onClear()}
                    onValueChange={onSearchChange}
                    size="sm"
                />
                <Input
                    type="date"
                    // className="w-full sm:max-w-[49%]"
                    // startContent={<SearchIcon />}
                    value={filterDate}
                    defaultValue={today}
                    // pattern="\d{4}-\d{2}-\d{2}"
                    // onValueChange={onDateChange}
                    onChange={onDateChange}
                />
            </div>
        );
      }, [
        filterValue,
        onSearchChange,
        hasSearchFilter,
        logs.length
    ]);

    const bottomContent = useMemo(() => {
        return (
          <div className="py-2 px-2 flex justify-between items-center">
            <span className="w-[30%] text-small text-default-400">
                    
            </span>
                
            {pages > 0 ? (
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                ) : null
            }
            <div className="hidden sm:flex w-[30%] justify-end gap-2">
              <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                Previous
              </Button>
              <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                Next
              </Button>
            </div>
          </div>
        );
    }, [items.length, page, pages, hasSearchFilter]);

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey];
    
        switch (columnKey) {
            // case "BADGENUMBER":
            //     return (
            //         <p className="text-bold text-sm capitalize">{staffs[cellValue]}</p>
            //     );
            // case "CHECKTIME":
            //     return (
            //         <p className="text-bold text-sm capitalize">{formatDateToTime(cellValue)}</p>
            //     );
            default:
                return cellValue;
        }
    }, [logs]);

    return (
        <div className="flex flex-col gap-3">
            <Table 
                color="success"
                isHeaderSticky
                selectionMode="single" 
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                // defaultSelectedKeys={["2"]} 
                aria-label="Example static collection table"
                bottomContent={bottomContent}
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
                bottomContentPlacement="outside"
                topContent={
                    topContent
                }
                // topContentPlacement="outside"
            >
                <TableHeader>
                    <TableColumn key="CODE" align="center" allowsSorting="true"> CODE</TableColumn>
                    <TableColumn key="STAFF" align="start" allowsSorting="true">STAFF</TableColumn>
                    <TableColumn key="TIME" align="center" allowsSorting="true">TIME</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No data found"} items={sortedLogs}>
                    {(item) => (
                        <TableRow key={item.LOGID}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
