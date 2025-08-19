import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useStaff } from "@/hooks/useStaff";
import {
  StaffFormData,
  Staff,
  StaffRole,
  Department,
  EmploymentStatus,
  ShiftType,
} from "@shared/staff";
import { Plus, Upload, X, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StaffFormProps {
  staff?: Staff;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

const StaffForm = ({ staff, onClose, trigger }: StaffFormProps) => {
  const {
    addStaff,
    updateStaff,
    isLoading,
    roles,
    staff: allStaff,
  } = useStaff();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [formData, setFormData] = useState<StaffFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "machine_operator",
    department: "production",
    jobTitle: "",
    hireDate: new Date().toISOString().split("T")[0],
    salary: 0,
    status: "active",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    shift: "day",
    workingHours: {
      startTime: "08:00",
      endTime: "17:00",
      breakDuration: 60,
    },
    roles: [],
    notes: "",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        department: staff.department,
        jobTitle: staff.jobTitle,
        hireDate: staff.hireDate,
        salary: staff.salary,
        status: staff.status,
        address: staff.address,
        emergencyContact: staff.emergencyContact,
        manager: staff.manager,
        shift: staff.shift,
        workingHours: staff.workingHours,
        roles: staff.roles.map((r) => r.id),
        notes: staff.notes || "",
      });
      if (staff.avatar) {
        if (typeof staff.avatar === "string") {
          setAvatarPreview(staff.avatar);
        }
      }
    }
  }, [staff]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof StaffFormData] as object),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: checked
        ? [...prev.roles, roleId]
        : prev.roles.filter((id) => id !== roleId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (staff) {
        await updateStaff(staff.id, formData);
        toast({
          title: "Success",
          description: "Staff member updated successfully!",
        });
      } else {
        await addStaff(formData);
        toast({
          title: "Success",
          description: "Staff member added successfully!",
        });
      }

      setOpen(false);
      onClose?.();

      // Reset form if adding new staff
      if (!staff) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          role: "machine_operator",
          department: "production",
          jobTitle: "",
          hireDate: new Date().toISOString().split("T")[0],
          salary: 0,
          status: "active",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "USA",
          },
          emergencyContact: {
            name: "",
            relationship: "",
            phone: "",
          },
          shift: "day",
          workingHours: {
            startTime: "08:00",
            endTime: "17:00",
            breakDuration: 60,
          },
          roles: [],
          notes: "",
        });
        setAvatarPreview("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save staff member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const defaultTrigger = (
    <Button className="bg-red-600 hover:bg-red-700 text-white">
      <Plus className="h-4 w-4 mr-2" />
      Add New Staff
    </Button>
  );

  const managers = allStaff.filter(
    (s) =>
      s.role === "manager" || s.role === "supervisor" || s.role === "admin",
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {staff ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar Upload */}
                <div>
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="relative">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-full border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      {avatarPreview && (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0"
                          onClick={() => {
                            setAvatarPreview("");
                            setFormData((prev) => ({
                              ...prev,
                              avatar: undefined,
                            }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100">
                        <Upload className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          Upload Photo
                        </span>
                      </div>
                      <input
                        id="avatar"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange("jobTitle", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleInputChange("role", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="production_lead">
                          Production Lead
                        </SelectItem>
                        <SelectItem value="machine_operator">
                          Machine Operator
                        </SelectItem>
                        <SelectItem value="quality_inspector">
                          Quality Inspector
                        </SelectItem>
                        <SelectItem value="warehouse_staff">
                          Warehouse Staff
                        </SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="shipping_clerk">
                          Shipping Clerk
                        </SelectItem>
                        <SelectItem value="sales_rep">
                          Sales Representative
                        </SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) =>
                        handleInputChange("department", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administration">
                          Administration
                        </SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="quality_control">
                          Quality Control
                        </SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="shipping">Shipping</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hireDate">Hire Date *</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) =>
                        handleInputChange("hireDate", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="salary">Annual Salary *</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary}
                      onChange={(e) =>
                        handleInputChange("salary", parseFloat(e.target.value))
                      }
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Employment Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="manager">Manager</Label>
                    <Select
                      value={formData.manager}
                      onValueChange={(value) =>
                        handleInputChange("manager", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager..." />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.firstName} {manager.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Work Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shift">Shift Type</Label>
                  <Select
                    value={formData.shift}
                    onValueChange={(value) => handleInputChange("shift", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day Shift</SelectItem>
                      <SelectItem value="night">Night Shift</SelectItem>
                      <SelectItem value="rotating">Rotating Shift</SelectItem>
                      <SelectItem value="flexible">Flexible Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.workingHours.startTime}
                      onChange={(e) =>
                        handleInputChange(
                          "workingHours.startTime",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.workingHours.endTime}
                      onChange={(e) =>
                        handleInputChange(
                          "workingHours.endTime",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="breakDuration">Break (minutes)</Label>
                    <Input
                      id="breakDuration"
                      type="number"
                      value={formData.workingHours.breakDuration}
                      onChange={(e) =>
                        handleInputChange(
                          "workingHours.breakDuration",
                          parseInt(e.target.value),
                        )
                      }
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Roles & Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Roles & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={role.id}
                        checked={formData.roles.includes(role.id)}
                        onCheckedChange={(checked) =>
                          handleRoleToggle(role.id, checked as boolean)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={role.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {role.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Address & Emergency Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) =>
                      handleInputChange("address.street", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) =>
                        handleInputChange("address.city", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) =>
                        handleInputChange("address.state", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) =>
                        handleInputChange("address.zipCode", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.address.country}
                      onChange={(e) =>
                        handleInputChange("address.country", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emergencyName">Full Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyContact.name}
                    onChange={(e) =>
                      handleInputChange("emergencyContact.name", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) =>
                      handleInputChange(
                        "emergencyContact.relationship",
                        e.target.value,
                      )
                    }
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyPhone">Phone Number</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) =>
                      handleInputChange(
                        "emergencyContact.phone",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes about this staff member..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : staff ? "Update Staff" : "Add Staff"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StaffForm;
