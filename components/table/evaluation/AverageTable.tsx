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
    SelectItem
} from "@nextui-org/react";
import { SearchIcon } from "../../icons/icons";
import { getAverageMarks } from "@/lib/actions/performance/evaluation.actions";
import { sessionUser } from "@/lib/actions/config/user.actions";

type YEAR = {
    FYEARID: number
    FYEAR: string
}
type Props = {
    years: YEAR[]
    sessionUser: sessionUser
}

type RECORD = {
    STAFFID: number
    STAFFCODE: string
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
    YEARSTAKEN: number
}

const columns = [
    { name: "NAME", uid: "STAFFNAME", sortable: true },
    { name: "YEAR 1", uid: "AVERAGE1", sortable: true },
    { name: "YEAR 2", uid: "AVERAGE2", sortable: true },
    { name: "YEAR 3", uid: "AVERAGE3", sortable: true },
    { name: "YEAR 4", uid: "AVERAGE4", sortable: true },
    { name: "YEAR 5", uid: "AVERAGE5", sortable: true },
    { name: "YEARS TAKEN", uid: "YEARSTAKEN", sortable: true },
    { name: "AVERAGE", uid: "AVERAGE", sortable: true },
    // { name: "ACTIONS", uid: "actions" },
];
export default function AverageTable({ years, sessionUser }: Props) {

    const [Data, setData] = useState<RECORD[]>([])
    const [isLoading, setIsLoading] = useState(true);

    const [selectedYear, setSelectedYear] = useState((years.length) ? "" + years[1].FYEARID : "1")

    const fetchData = async (yearid: number) => {
        let records = await getAverageMarks(yearid, sessionUser)

        setIsLoading(false)

        if (records && records.error != "") {
            console.log(records.error)
            return;
        }
        if (records)
            setData(records.data)
    }

    useEffect(() => {
        fetchData(selectedYear as unknown as number)
    }, [])

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

        return filteredData;
    }, [Data, filterValue]);

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
                        description={data.STAFFCODE}
                        name={data.STAFFNAME}
                    />
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
                return cellValue;
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
            </div>
        );
    }, [
        filterValue,
        onSearchChange,
        onRowsPerPageChange,
        Data.length,
        hasSearchFilter,
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
            topContentPlacement="inside"
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
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
