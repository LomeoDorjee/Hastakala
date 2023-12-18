"use client"
import React, { ChangeEvent, Key, useCallback, useEffect, useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor,
    Spinner,
    Select,
    SelectItem,
    Tooltip,
    CardHeader,
    CardBody,
    Card,
    Divider
} from "@nextui-org/react";
import { ChevronDownIcon, SearchIcon } from "../../icons/icons";
import { getAverageMarks, getFinalRecord } from "@/lib/actions/performance/evaluation.actions";
import toast, { CheckmarkIcon, ErrorIcon } from "react-hot-toast";

type YEAR = {
    FYEARID: number
    FYEAR: string
}
type Props = {
    years: YEAR[]
}

type RECORD = {
    STAFFID: number
    STAFFCODE: string
    DEPARTMENT: string
    DESIGNATION: string
    FYEARID: number
    AVERAGE1: number
    AVERAGE2: number
    AVERAGE3: number
    AVERAGE4: number
    AVERAGE5: number
    AVERAGE: number
    STAFFNAME: string
    YEAR1: string
    YEAR2: string
    YEAR3: string
    YEAR4: string
    YEAR5: string
    SERVICE: number
    EDUCATION: number
    ATTENDANCE: number
    APPRECIATION: number
    WARNING: number
    YEARSTAKEN: number
    ISELIGIBLE: string
    ADMINTOTAL: number
    GRANDTOTAL: number
    LASTPROMOTION: string
}

const INITIAL_VISIBLE_COLUMNS = ["STAFFNAME", "AVERAGE", "SERVICE", "EDUCATION", "ADMINTOTAL", "GRANDTOTAL"];

const columns = [
    { name: "NAME", uid: "STAFFNAME", sortable: true },
    { name: "DEPARTMENT", uid: "DEPARTMENT", sortable: true },
    { name: "YEAR 1", uid: "AVERAGE1", sortable: true },
    { name: "YEAR 2", uid: "AVERAGE2", sortable: true },
    { name: "YEAR 3", uid: "AVERAGE3", sortable: true },
    { name: "YEAR 4", uid: "AVERAGE4", sortable: true },
    { name: "YEAR 5", uid: "AVERAGE5", sortable: true },
    { name: "PERFORMANCE", uid: "AVERAGE", sortable: true },
    { name: "SERVICE", uid: "SERVICE", sortable: true },
    { name: "EDUCATION", uid: "EDUCATION", sortable: true },
    { name: "ATTENDANCE", uid: "ATTENDANCE", sortable: true },
    { name: "APPRECIATION", uid: "APPRECIATION", sortable: true },
    { name: "WARNING", uid: "WARNING", sortable: true },
    { name: "ADMINISTRATION", uid: "ADMINTOTAL", sortable: true },
    { name: "ELIGIBLE", uid: "ISELIGIBLE", sortable: true },
    { name: "YEARS TAKEN", uid: "YEARSTAKEN", sortable: true },
    { name: "PROMOTION YEAR", uid: "LASTPROMOTION", sortable: true },
    { name: "TOTAL", uid: "GRANDTOTAL", sortable: true },
    // { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
    { name: "Staff", uid: "P1-" },
    { name: "Producer", uid: "P2-" },
    { name: "All", uid: "all" },
];

export default function FinalEvalutionTable({ years }: Props) {

    const [Data, setData] = useState<RECORD[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedYear, setSelectedYear] = useState((years.length) ? "" + years[1].FYEARID : "1")
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));

    const fetchData = async (yearid: number) => {
        let records = await getFinalRecord(yearid)

        setIsLoading(false)
        if (records && records.error != "") {
            toast.error(records.error)
            return;
        }
        if (records)
            setData(records.data)
    }

    useEffect(() => {
        fetchData(selectedYear as unknown as number)
    }, [])

    // Column Filter
    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "age",
        direction: "ascending",
    });

    const [page, setPage] = useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredData = Data;

        if (hasSearchFilter) {
            filteredData = filteredData.filter((data) =>
                data.STAFFNAME.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        if (statusFilter !== "all") {
            filteredData = filteredData.filter((user) =>
                user.STAFFCODE.substring(0, 3).includes(statusFilter),
            );
        }

        return filteredData;
    }, [Data, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a: RECORD, b: RECORD) => {
            const first = a[sortDescriptor.column as keyof RECORD] as number;
            const second = b[sortDescriptor.column as keyof RECORD] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    const renderCell = useCallback((data: RECORD, columnKey: Key) => {
        const cellValue = data[columnKey as keyof RECORD];

        switch (columnKey) {
            case "STAFFNAME":
                return (
                    <User
                        description={data.STAFFCODE + " | " + data.DESIGNATION}
                        name={data.STAFFNAME}
                    />
                );
            case "AVERAGE":
                return (
                    <Tooltip
                        content={
                            <div className="flex flex-col">
                                <p className="pb-1 mb-1 font-bold border-b border-black">{"YEARS TAKEN: " + data.YEARSTAKEN}</p>
                                <p className="pb-1 mb-1 font-bold border-b border-black">{"LAST PROMO.: " + data.LASTPROMOTION}</p>
                                <p>{data.YEAR1 + ": " + data.AVERAGE1}</p>
                                <p>{data.YEAR2 + ": " + data.AVERAGE2}</p>
                                <p>{data.YEAR3 + ": " + data.AVERAGE3}</p>
                                <p>{data.YEAR4 + ": " + data.AVERAGE4}</p>
                                <p>{data.YEAR5 + ": " + data.AVERAGE5}</p>
                            </div>
                        }
                        color="foreground"
                        placement="left"
                        delay={800}
                        offset={-15}
                    >
                        <p className="cursor-pointer w-full text-center">{cellValue}</p>
                    </Tooltip>
                );
            case "ISELIGIBLE":
                return (
                    <Tooltip content={cellValue} color={(cellValue == 'Eligible') ? "success" : "danger"}>
                        <Chip
                            color={(cellValue == 'Eligible') ? "success" : "danger"}
                            variant="flat"
                        >
                            {(cellValue == "Eligible") ? <CheckmarkIcon /> : <ErrorIcon />}
                        </Chip>
                    </Tooltip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button size="sm" variant="light">
                                    More
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem>View</DropdownItem>
                                <DropdownItem>Edit</DropdownItem>
                                <DropdownItem>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return <p className="text-center">{cellValue}</p>;
        }
    }, []);

    const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const handleFyearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value) {
            setIsLoading(true)
            fetchData(e.target.value as unknown as number)
            setSelectedYear(e.target.value)
        }
    };

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-row gap-3 justify-between items-center">
                <Input
                    isClearable
                    className="w-full"
                    placeholder="Search by Staff Name..."
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                    size="sm"
                />
                <Select
                    label="Fiscal Year"
                    className="max-w-xs"
                    size="sm"
                    placeholder="Select Fiscal Year"
                    onChange={handleFyearChange}
                    defaultSelectedKeys={[selectedYear]}
                >
                    {years.map((year) => (
                        <SelectItem key={year.FYEARID} value={year.FYEAR}>
                            {year.FYEAR}
                        </SelectItem>
                    ))}
                </Select>
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
                <Dropdown>
                    <DropdownTrigger className="hidden sm:flex">
                        <Button
                            endContent={<ChevronDownIcon className="text-small" />}
                            variant="flat"
                            size="lg"
                            className="rounded-lg"
                        >
                            Columns
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Table Columns"
                        closeOnSelect={false}
                        selectedKeys={visibleColumns}
                        selectionMode="multiple"
                        onSelectionChange={setVisibleColumns}
                    >
                        {columns.map((column) => (
                            <DropdownItem key={column.uid}>
                                {column.name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }, [
        filterValue,
        onSearchChange,
        onRowsPerPageChange,
        Data.length,
        hasSearchFilter,
        statusFilter,
        visibleColumns,
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="text-default-400 text-small">Total {Data?.length} Users</span>

                {pages > 0 ? (
                    <Pagination
                        showControls
                        classNames={{
                            cursor: "bg-foreground text-background",
                        }}
                        color="secondary"
                        isDisabled={hasSearchFilter}
                        page={page}
                        total={pages}
                        variant="light"
                        onChange={setPage}
                    />
                ) : null
                }
                <label className="flex items-center text-default-400 text-small">
                    Rows per page:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={onRowsPerPageChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
        );
    }, [items.length, page, pages, hasSearchFilter]);

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectionMode="single"
            color="success"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSortChange={setSortDescriptor}
            classNames={{
                wrapper: "max-w-screen-xl",
            }}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid !== "name" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={"No Data found"}
                items={items}
                isLoading={isLoading}
                loadingContent={<Spinner color="secondary" />}
            >
                {(item) => (
                    <TableRow key={item.STAFFCODE}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
