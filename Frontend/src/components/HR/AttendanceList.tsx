import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

interface Attendance {
  id: number;
  employee_name: string;
  employee_id: string;
  date: string;
  check_in_time: string;
  check_out_time: string;
  total_hours: number;
  is_present: boolean;
  is_late: boolean;
  status: string;
}

const AttendanceList: React.FC = () => {
  const { refreshTrigger } = useData();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('');

  // Mock data
  const mockAttendance: Attendance[] = [
    {
      id: 1,
      employee_name: 'Rajesh Kumar',
      employee_id: 'EMP1001',
      date: '2024-01-20',
      check_in_time: '09:15:00',
      check_out_time: '18:30:00',
      total_hours: 9.25,
      is_present: true,
      is_late: true,
      status: 'Present'
    },
    {
      id: 2,
      employee_name: 'Priya Sharma',
      employee_id: 'EMP1002',
      date: '2024-01-20',
      check_in_time: '08:45:00',
      check_out_time: '17:45:00',
      total_hours: 9.0,
      is_present: true,
      is_late: false,
      status: 'Present'
    },
    {
      id: 3,
      employee_name: 'Dr. Amit Verma',
      employee_id: 'EMP1003',
      date: '2024-01-20',
      check_in_time: '',
      check_out_time: '',
      total_hours: 0,
      is_present: false,
      is_late: false,
      status: 'Absent'
    }
  ];

  useEffect(() => {
    loadAttendance();
  }, [refreshTrigger, selectedDate]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setAttendance(mockAttendance);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to load attendance data');
      setLoading(false);
    }
  };

  const filteredAttendance = attendance.filter(record => {
    const matchesFilter = !filterStatus || record.status === filterStatus;
    return matchesFilter;
  });

  const markAttendance = async (employeeId: string, status: 'present' | 'absent') => {
    try {
      setAttendance(attendance.map(record =>
        record.employee_id === employeeId
          ? {
              ...record,
              is_present: status === 'present',
              status: status === 'present' ? 'Present' : 'Absent',
              check_in_time: status === 'present' ? '09:00:00' : '',
              check_out_time: status === 'present' ? '18:00:00' : '',
              total_hours: status === 'present' ? 9 : 0
            }
          : record
      ));
      toast.success(`Attendance marked as ${status}`);
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return CheckCircle;
      case 'Absent': return XCircle;
      default: return Clock;
    }
  };

  const presentCount = attendance.filter(r => r.is_present).length;
  const absentCount = attendance.filter(r => !r.is_present).length;
  const lateCount = attendance.filter(r => r.is_late).length;
  const totalHours = attendance.reduce((sum, r) => sum + r.total_hours, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Track employee attendance and working hours</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-emerald-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-amber-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Late Arrivals</p>
              <p className="text-2xl font-bold text-amber-600">{lateCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold">
              Attendance for {new Date(selectedDate).toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading attendance data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => {
                  const StatusIcon = getStatusIcon(record.status);
                  return (
                    <tr key={record.id}>
                      <td>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{record.employee_name}</div>
                            <div className="text-sm text-gray-500">{record.employee_id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {record.check_in_time ? (
                            <div>
                              <div className="font-medium">{record.check_in_time}</div>
                              {record.is_late && (
                                <div className="text-amber-600 text-xs">Late</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">--:--</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {record.check_out_time ? (
                            <div className="font-medium">{record.check_out_time}</div>
                          ) : (
                            <span className="text-gray-400">--:--</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">
                          {record.total_hours > 0 ? `${record.total_hours.toFixed(1)}h` : '--'}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${getStatusColor(record.status)} flex items-center w-fit`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {record.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          {!record.is_present ? (
                            <button
                              onClick={() => markAttendance(record.employee_id, 'present')}
                              className="btn btn-success btn-sm"
                            >
                              Mark Present
                            </button>
                          ) : (
                            <button
                              onClick={() => markAttendance(record.employee_id, 'absent')}
                              className="btn btn-outline btn-sm"
                            >
                              Mark Absent
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredAttendance.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No attendance records found for the selected date.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;