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
import { DeleteIcon, SearchIcon } from "@/components/icons/icons";
import toast from "react-hot-toast";
import { IGNOREDDELAY, IGNOREDDELAY_YM, getIgnoredDelayStaffs, removeIgnoredDelay } from "@/lib/actions/pis/leave.actions";

type YEAR = {
    FYEARID: number
    FYEAR: string
}
type Props = {
    yearmonth: IGNOREDDELAY_YM[]
}

type RECORD = IGNOREDDELAY

const columns = [
    { name: "NAME", uid: "STAFFNAME", sortable: true },
    { name: "YEAR MONTH", uid: "YearMonth", sortable: true },
    { name: "IDATEAD", uid: "IDateAD", sortable: true },
    { name: "IDATEVS", uid: "IDateVS", sortable: true },
    { name: "MINUTES", uid: "Minutes", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function AdminavgTable({ yearmonth }: Props) {

    const [Data, setData] = useState<RECORD[]>([])
    const [isLoading, setIsLoading] = useState(true);

    const [selectedYear, setSelectedYear] = useState((yearmonth.length) ? "" + yearmonth[0].YEARMONTH : "1")

    const fetchData = async (ym: string) => {
        let records = await getIgnoredDelayStaffs(ym)

        setIsLoading(false)
        if (records.status != "") {
            toast.error(records.status)
            return;
        }
        if (records)
            setData(records.data)
    }

    useEffect(() => {
        fetchData(selectedYear)
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

    const handleDelete = async (staffid: number, staffname: string) => {

        if (!confirm(`REMOVE IGNORED DELAYS FOR ${staffname}?`)) {
            return
        }

        const res: {
            status: string
        } = await removeIgnoredDelay(staffid, selectedYear)

        if (res.status != "") {
            toast.error(res.status)
            return
        }

        fetchData(selectedYear)

        toast.success("Data Deleted")

    }


    const renderCell = useCallback((data: RECORD, columnKey: Key) => {
        const cellValue = data[columnKey as keyof RECORD];

        switch (columnKey) {
            case "STAFFNAME":
                return (
                    <User
                        description={data.STAFFCODE + " "}
                        name={data.STAFFNAME}
                    />
                );
            case "actions":
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        <Button
                            color="danger"
                            onClick={e => handleDelete(data.StaffID, data.STAFFNAME)}
                            isIconOnly
                        >
                            <DeleteIcon />
                        </Button>
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

    const handleYMChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value) {
            setIsLoading(true)
            fetchData(e.target.value)
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
                    color="success"
                    defaultSelectedKeys={[selectedYear]}
                    className="hidden sm:flex sm:max-w-sm"
                    aria-label="Year Month"
                    size="sm"
                    onChange={handleYMChange}
                >
                    {yearmonth.map((ym) => (
                        <SelectItem key={ym.YEARMONTH}>
                            {(ym.YEARMONTH)}
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
