import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import type { MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import { Button, Tooltip } from "@mui/material";
import { Grid, GridProps } from "@mui/material";
import Loader3 from "../components/common/Loader3";


import moment from "moment";

type JobData = {
  assignee: string;
  assigner: string;
  SourceID: string;
  WorkType: string;
  StatusString: string;
  PostDate: string;
  speciality: string;
  facility: string;
  facilityAddress: string;
  city: string;
  state: string;
  shift: string;
  weeks: number;
  billrate: number;
  startDate: string;
  endDate: string;
  CustomField5?: string;
  AutoOffer_Fl?: boolean;
  HotFL?: boolean;
  Note?: string;
  SourceName?: string;
  Positions?: number;
  Degree?: string;
  JobSpecialty?: string;
  Facility?: string;
  Address?: string;
  City?: string;
  State?: string;
  Shift?: string;
  DurationWeeks?: number;
  BillRate?: number;
  StartDate?: string;
  EndDate?: string;
};

const Index = () => {
  const [data, setData] = useState<JobData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      const requestOptions: any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        "https://api.theartemis.ai/api/allvms/dumpByVMS/AHSA",
        requestOptions
      );
      const secondResponse = await fetch(
        "https://api.theartemis.ai/api/allvms/dumpByVMS/StaffingEngine",
        requestOptions
      );
      const thirdResponse = await fetch(
        "https://api.theartemis.ai/api/allvms/dumpByVMS/Focusone",
        requestOptions
      );

      if (!thirdResponse.ok) {
        console.error("Error fetching third API:", thirdResponse.statusText);
        return;
      }

      const result = await response.json();
      const secondResult = await secondResponse.json();
      const thirdResult = await thirdResponse.json();

      const filteredData = result[0].filter(
        (item: JobData) => item.WorkType === "Perm"
      );
      const secondFilteredData = secondResult[0].filter(
        (item: JobData) => item.WorkType === "Permanent"
      );
      const thirdFilteredData = Array.isArray(thirdResult[0])
        ? thirdResult[0].filter(
            (item: JobData) => item.WorkType === "Direct Hire"
          )
        : [];

      const combinedData = [
        ...filteredData,
        ...secondFilteredData,
        ...thirdFilteredData,
      ];
      console.log("Combined Data:", combinedData);
      setData(combinedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<JobData>[]>(
    () => [
      {
        accessorFn: (row) => `${row.SourceID}`,
        id: "SourceID",
        header: "Job-Id",
        enableClickToCopy: true,
        enableHiding: true,
        enableColumnPinning: true,
        enableColumnActions: true,
        size: 95,
        Cell: ({ renderedCellValue, row }: any) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              fontSize: "12px",
              height: "25px",
            }}
          >
            <Tooltip title={renderedCellValue}>
              <span>{renderedCellValue}</span>
            </Tooltip>
          </Box>
        ),
      },
      {
        accessorKey: "WorkType",
        header: "Type",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 90,
      },
      {
        accessorKey: "SourceName",
        header: "VMS",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 90,
      },
      {
        accessorKey: "StatusString",
        enableClickToCopy: true,
        filterVariant: "multi-select",
        enableHiding: true,
        enableColumnPinning: true,
        enableColumnActions: true,
        header: "Status",
        size: 170,
        Cell: ({ renderedCellValue, row, cell }: any) => (
          <>
            <Box
              sx={(theme) => ({
                backgroundColor:
                  cell.getValue() === "Closed"
                    ? theme.palette.error.dark
                    : cell.getValue() === "On Hold"
                    ? "#ff9800"
                    : cell.getValue() === "Pending"
                    ? "#999999"
                    : cell.getValue() === "Interviews occurring"
                    ? "#03a9f4"
                    : cell.getValue() === "Cancelled"
                    ? "#ef5350"
                    : cell.getValue() === "Filled"
                    ? "#01579b"
                    : cell.getValue() === "Engagement Pending"
                    ? "#9c27b0"
                    : cell.getValue() === "Temp Block"
                    ? "#0000ff"
                    : theme.palette.success.main,
                borderRadius: ".5rem",
                color: "rgb(255, 255, 255)",
                fontSize: "12px",
                height: "25px",
                padding: "0.25rem",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <Tooltip title={renderedCellValue}>
                <span>
                  {renderedCellValue === "O" ? "Open" : renderedCellValue}
                </span>
              </Tooltip>
            </Box>
            <span>
              {row.original.CustomField5 ? (
                <Tooltip title={row.original.CustomField5}>
                  <img
                    style={{ width: "17px", marginLeft: "5px" }}
                    src="https://img.icons8.com/?size=100&id=59825&format=png&color=000000"
                  />
                </Tooltip>
              ) : null}
              {row.original.AutoOffer_Fl &&
              row.original.AutoOffer_Fl == true ? (
                <>
                  <img
                    className="hotjobimage"
                    src="https://media.tenor.com/VUH3A7tK-qgAAAAi/dm4uz3-foekoe.gif"
                    style={{}}
                  />
                </>
              ) : (
                <></>
              )}
              {row.original.HotFL && row.original.HotFL == true ? (
                <>🌟</>
              ) : (
                <></>
              )}
            </span>
          </>
        ),
      },
      {
        accessorKey: "Positions",
        header: "Open Position",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 90,
      },
      {
        accessorKey: "Degree",
        header: "Profession",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 90,
      },
      {
        accessorKey: "JobSpecialty",
        header: "Speciality",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 150,
      },
      {
        accessorKey: "Facility",
        header: "Facility",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 150,
      },
      {
        accessorKey: "Address",
        header: "Facility Address",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 150,
      },
      {
        accessorKey: "City",
        header: "City",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 150,
      },
      {
        accessorKey: "State",
        header: "State",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 100,
      },
      {
        accessorKey: "Shift",
        header: "Shift",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 150,
      },
      {
        accessorKey: "DurationWeeks",
        header: "Weeks",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 100,
      },
      {
        accessorKey: "BillRate",
        header: "Bill Rate",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 90,
      },
      {
        accessorKey: "StartDate",
        header: "Start Date",
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          if (!value) return " ";
          const date = new Date(value);
          if (isNaN(date.getTime())) return "Invalid Date";
          return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
        },
        size: 110,
      },
      {
        accessorKey: "PostDate",
        header: "Post Date",
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          if (!value) return " ";
          const date = new Date(value);
          if (isNaN(date.getTime())) return "Invalid Date";
          return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
        },
        size: 110,
      },
    ],
    []
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "Segoe UI",
        fontSize: "0.8rem",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontFamily: "monospace",
            fontSize: "1.5rem",
            color:"#333",
          }}
        >
          Permanent Jobs
        </h2>
        {loading ? (
         <div style={{ textAlign: "center" }}>
         <Loader3 />
       </div>
        ) : (
          <MaterialReactTable
            columns={columns}
            data={data}
            enableSorting
            enablePagination
            enableRowSelection
            enableGrouping
            enableColumnPinning// Enable pinning feature
            initialState={{
              density: "compact",
              pagination: { pageSize: 10, pageIndex: 0 },
            }}
            muiPaginationProps={{
              rowsPerPageOptions: [10, 20, 50, 100],
              showFirstButton: true,
              showLastButton: true,
            }}
            enableColumnActions
            enableColumnFilters
            enableColumnDragging={false}
            enableColumnResizing
            muiTableProps={{
              sx: {
                border: "0.1px solid rgba(224, 224, 224, 1)",
                "& .MuiTableCell-root": {
                  fontSize: "0.75rem",
                  border: "1px solid rgba(224, 224, 224, 0.5)",
                },
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                fontSize: "0.75rem",
                padding: "1px",
                fontWeight: "bold",
                border: "0.1px solid rgba(224, 224, 224, 0.5)",
                backgroundColor: "#f5f5f5",
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                fontSize: "0.75rem",
                padding: "1px",
                border: "0.1px solid rgba(224, 224, 224, 0.5)",
              },
            }}
            muiTableContainerProps={{
              sx: {
                border: "1px solid rgba(224, 224, 224, 1)",
              },
            }}
            muiTopToolbarProps={{
              sx: {
                fontSize: "0.75rem",
                "& .MuiButton-root": {
                  fontSize: "0.75rem",
                },
              },
            }}
            muiBottomToolbarProps={{
              sx: {
                fontSize: "0.75rem",
                "& .MuiButton-root": {
                  fontSize: "0.75rem",
                },
              },
            }}
            renderDetailPanel={({ row }: any) => (
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontFamily: "Segoe UI, sans-serif",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <h4
                  style={{
                    fontSize: "1rem",
                    marginBottom: "20px",
                    color: "#333",
                    borderBottom: "1px solid #e0e0e0",
                    paddingBottom: "8px",
                  }}
                >
                  Job Description
                </h4>

                <div
                  dangerouslySetInnerHTML={{
                    __html: row.original.Note || "No description available.",
                  }}
                  style={{
                    marginBottom: "20px",
                    lineHeight: "1.5",
                    color: "#444",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "50px",
                  }}
                >
                  {/* Column 1 */}
                  <div>
                    <div className="job-field">
                      <div className="job-label">
                        <label>Job-ID</label>
                      </div>
                      <div className="job-value">
                        <Tooltip title={row.original.SourceID}>
                          <input
                            type="text"
                            className="form-control"
                            value={row.original.SourceID || "NA"}
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job-Title</label>
                      </div>
                      <div className="job-value">
                        <Tooltip title={row.original.Title}>
                          <input
                            type="text"
                            className="form-control"
                            value={row.original.Title || "NA"}
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job Type</label>
                      </div>
                      <div className="job-value">
                        <Tooltip title={row.original.WorkType}>
                          <input
                            type="text"
                            className="form-control"
                            value={
                              row.original.WorkType == "1"
                                ? "Travel"
                                : row.original.WorkType == "2"
                                ? "Perm"
                                : row.original.WorkType == "3"
                                ? "Per Diem"
                                : row.original.WorkType || "NA"
                            }
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job Status</label>
                      </div>
                      <div className="job-value">
                        <Tooltip title={row.original.StatusString}>
                          <input
                            type="text"
                            className="form-control"
                            value={row.original.StatusString || "NA"}
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job Profession</label>
                      </div>
                      <div className="job-value">
                        <Tooltip title={row.original.Degree}>
                          <input
                            type="text"
                            className="form-control"
                            value={row.original.Degree || "NA"}
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job Speciality</label>
                      </div>
                      <div className="job-value">
                        <Tooltip title={row.original.JobSpecialty}>
                          <input
                            type="text"
                            className="form-control"
                            value={row.original.JobSpecialty || "NA"}
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job Facility</label>
                      </div>
                      <div className="job-value">
                        <Tooltip title={row.original.Facility}>
                          <input
                            type="text"
                            className="form-control"
                            value={row.original.Facility || "NA"}
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="job-field">
                      <div className="job-label">
                        <label>Job Guaranteed Hours</label>
                      </div>
                      <div className="job-value">
                        <input
                          type="text"
                          className="form-control"
                          value={row.original.GuaranteedHours || "NA"}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div>
                    <div className="job-field">
                      <div className="job-label">
                        <label>Job City</label>
                      </div>
                      <div className="job-value">
                        <Tooltip title={row.original.City}>
                          <input
                            type="text"
                            className="form-control"
                            value={row.original.City || "NA"}
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job State</label>
                      </div>
                      <div className="job-value">
                        <Tooltip title={row.original.State}>
                          <input
                            type="text"
                            className="form-control"
                            value={row.original.State || "NA"}
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job On Call Rate</label>
                      </div>
                      <div className="job-value">
                        <input
                          type="text"
                          className="form-control"
                          value={`$ ${row.original.OnCallRate || "NA"}`}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job Bill Rate</label>
                      </div>
                      <div className="job-value">
                        <input
                          type="text"
                          className="form-control"
                          value={`$ ${row.original.BillRate || "NA"}`}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>VMS Name</label>
                      </div>
                      <div className="job-value">
                        <Tooltip title={row.original.SourceName}>
                          <input
                            type="text"
                            className="form-control"
                            value={row.original.SourceName || "NA"}
                            disabled
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job Start Date</label>
                      </div>
                      <div className="job-value">
                        <input
                          className="form-control"
                          value={
                            moment(row.original.FormattedStartDate).format(
                              "MM-DD-YYYY"
                            ) === "Invalid date"
                              ? "NA"
                              : moment(row.original.FormattedStartDate).format(
                                  "MM-DD-YYYY"
                                ) || "NA"
                          }
                          disabled
                        />
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job End Date</label>
                      </div>
                      <div className="job-value">
                        <input
                          className="form-control"
                          value={
                            moment(row.original.EndDate).format(
                              "MM-DD-YYYY"
                            ) === "Invalid date"
                              ? "NA"
                              : moment(row.original.EndDate).format(
                                  "MM-DD-YYYY"
                                ) || "NA"
                          }
                          disabled
                        />
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job Posted On</label>
                      </div>
                      <div className="job-value">
                        <input
                          className="form-control"
                          value={
                            moment(row.original.PostDate).format(
                              "MM-DD-YYYY"
                            ) === "Invalid date"
                              ? "NA"
                              : moment(row.original.PostDate).format(
                                  "MM-DD-YYYY"
                                ) || "NA"
                          }
                          disabled
                        />
                      </div>
                    </div>

                    <div className="job-field">
                      <div className="job-label">
                        <label>Job Bonus</label>
                      </div>
                      <div className="job-value">
                        <input
                          type="text"
                          className="form-control"
                          value={`$ ${row.original.Bonus || "NA"}`}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom row - full width */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "24px",
                    marginTop: "16px",
                  }}
                ></div>

                <style jsx>{`
                  .job-field {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                  }

                  .job-label {
                    width: 140px;
                    font-weight: 600;
                    color: #555;
                    flex-shrink: 0;
                  }

                  .job-value {
                    flex: 1;
                  }

                  .form-control {
                    width: 100%;
                    padding: 8px 12px;
                    font-size: 0.875rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    background-color: #fff;
                    color: #333;
                  }

                  .form-control:disabled {
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                    opacity: 1;
                  }

                  @media (max-width: 768px) {
                    .job-field {
                      flex-direction: column;
                      align-items: flex-start;
                    }

                    .job-label {
                      width: 100%;
                      margin-bottom: 4px;
                    }

                    .job-value {
                      width: 100%;
                    }
                  }
                `}</style>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
