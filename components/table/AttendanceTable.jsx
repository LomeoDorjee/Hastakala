"use client"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Input, Button, Select, SelectItem } from "@nextui-org/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { fetchDeviceLog } from "@/lib/actions/pis/attendance.actions"
import { formatDateToTime } from "@/lib/utils"
import { SearchIcon } from "@/components/icons/icons"

const statusOptions = [
    { name: "Staff", uid: "P1-" },
    { name: "Producer", uid: "P2-" },
    { name: "All", uid: "all" },
];

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
    const [statusFilter, setStatusFilter] = useState("all");

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredUsers = logs;

        if (hasSearchFilter) {
            filteredUsers = filteredUsers?.filter((user) =>
                user.STAFF.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        if (statusFilter !== "all") {
            filteredUsers = filteredUsers.filter((user) =>
                user.CODE.substring(0, 3).includes(statusFilter),
            );
        }

        return filteredUsers;
    }, [logs, filterValue, statusFilter]);

    // Fetch Data
    const [filterDate, setFilterDate] = useState(today);

    const onDateChange = useCallback((e) => {
        if (e.target.value) {
            console.log(e.target.value)
            setFilterDate(new Date(e.target.value).toISOString().split('T')[0])
            fetchLogs(e.target.value)
        }
    }, []);

    // Sorting
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "CODE",
        direction: "ascending",
    });

    const sortedLogs = useMemo(() => {
        return filteredItems.sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);

    // Pagination
    const [page, setPage] = useState(1);
    const rowsPerPage = 9;

    const pages = Math.ceil(filteredItems.length / rowsPerPage);
   
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage;
        return sortedLogs.slice(start, end);
    }, [page, sortedLogs]);

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




    // Inputs
    const topContent = useMemo(() => {
        return (
            <div className="flex justify-between gap-4 items-center w-full">
                <Input
                    isClearable
                    placeholder="Search by Staff Name..."
                    startContent={ <SearchIcon /> }
                    value={filterValue}
                    onValueChange={onSearchChange}
                    size="sm"
                />
                <Input
                    type="date"
                    value={filterDate}
                    defaultValue={today}
                    onChange={onDateChange}
                    size="sm"
                />
                <Select
                    color="success"
                    defaultSelectedKeys={["all"]}
                    className="hidden sm:flex sm:max-w-sm"
                    aria-label="Staff Type"
                    size="sm"
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    {statusOptions.map((status) => (
                        <SelectItem key={status.uid} className="capitalize">
                            {(status.name)}
                        </SelectItem>
                    ))}
                </Select>
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
                aria-label="Attendance Table"
                bottomContent={bottomContent}
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
                bottomContentPlacement="outside"
                topContent={topContent}
            >
                <TableHeader>
                    <TableColumn key="CODE" align="center" allowsSorting="true"> CODE</TableColumn>
                    <TableColumn key="STAFF" align="start" allowsSorting="true">STAFF</TableColumn>
                    <TableColumn key="TIME" align="center" allowsSorting="true">TIME</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No data found"} items={items}>
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
