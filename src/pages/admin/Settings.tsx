// src/pages/SettingsPage/SettingsPage.tsx
import { useState } from "react";
import Header from "../../design-system/organisms/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../design-system/atoms/Card/Card";
import { Input } from "../../design-system/atoms/Input/Index";
import { Button } from "../../design-system/atoms/Button/Button";

type SettingsTab =
  | "general"
  | "restaurant"
  | "billing"
  | "users"
  | "appearance"
  | "notifications";

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [isSaving, setIsSaving] = useState(false);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    businessName: "Kot Restaurant",
    email: "contact@kotrestaurant.com",
    phone: "+91 98765 43210",
    address: "123 MG Road, Bangalore",
    gstin: "29ABCDE1234F1Z5",
    currency: "INR",
    timezone: "Asia/Kolkata",
  });

  // Restaurant Settings State
  const [restaurantSettings, setRestaurantSettings] = useState({
    openTime: "09:00",
    closeTime: "23:00",
    tableCount: 25,
    avgServiceTime: 45,
    maxCapacity: 100,
    takeawayEnabled: true,
    deliveryEnabled: false,
  });

  // Billing Settings State
  const [billingSettings, setBillingSettings] = useState({
    taxRate: 5,
    serviceCharge: 10,
    autoRoundOff: true,
    printReceipt: true,
    emailReceipt: false,
    paymentMethods: {
      cash: true,
      card: true,
      upi: true,
    },
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    primaryColor: "#FF6B35",
    fontSize: "medium",
    compactMode: false,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    orderAlerts: true,
    lowStockAlerts: true,
    staffAlerts: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("Settings saved successfully!");
  };

  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "restaurant", label: "Restaurant", icon: "🏪" },
    { id: "billing", label: "Billing & Tax", icon: "💰" },
    { id: "users", label: "Users & Roles", icon: "👥" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ];

  return (
    <div className="min-h-screen bg-kot-light">
      <Header
        title="Settings"
        subtitle="Manage your restaurant configuration"
        userName="Admin"
        userRole="Manager"
        onLogout={() => console.log("Logout")}
      />

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card padding="sm">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeTab === tab.id
                        ? "bg-kot-primary text-white font-semibold"
                        : "text-kot-text hover:bg-kot-light"
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <>
                <Card padding="lg">
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>
                      Update your restaurant basic details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input
                        label="Business Name"
                        value={generalSettings.businessName}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            businessName: e.target.value,
                          })
                        }
                        required
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Email"
                          type="email"
                          value={generalSettings.email}
                          onChange={(e) =>
                            setGeneralSettings({
                              ...generalSettings,
                              email: e.target.value,
                            })
                          }
                        />
                        <Input
                          label="Phone"
                          type="tel"
                          value={generalSettings.phone}
                          onChange={(e) =>
                            setGeneralSettings({
                              ...generalSettings,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Input
                        label="Address"
                        value={generalSettings.address}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            address: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="GSTIN"
                        value={generalSettings.gstin}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            gstin: e.target.value,
                          })
                        }
                        helperText="Goods and Services Tax Identification Number"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card padding="lg">
                  <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                    <CardDescription>
                      Configure currency and timezone
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-kot-darker mb-1.5">
                          Currency
                        </label>
                        <select
                          value={generalSettings.currency}
                          onChange={(e) =>
                            setGeneralSettings({
                              ...generalSettings,
                              currency: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-kot-chart rounded-lg bg-kot-white text-kot-darker focus:border-kot-primary focus:ring-2 focus:ring-kot-primary/20 outline-none"
                        >
                          <option value="INR">INR - Indian Rupee (₹)</option>
                          <option value="USD">USD - US Dollar ($)</option>
                          <option value="EUR">EUR - Euro (€)</option>
                          <option value="GBP">GBP - Pound (£)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-kot-darker mb-1.5">
                          Timezone
                        </label>
                        <select
                          value={generalSettings.timezone}
                          onChange={(e) =>
                            setGeneralSettings({
                              ...generalSettings,
                              timezone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-kot-chart rounded-lg bg-kot-white text-kot-darker focus:border-kot-primary focus:ring-2 focus:ring-kot-primary/20 outline-none"
                        >
                          <option value="Asia/Kolkata">
                            Asia/Kolkata (IST)
                          </option>
                          <option value="America/New_York">
                            America/New_York (EST)
                          </option>
                          <option value="Europe/London">
                            Europe/London (GMT)
                          </option>
                          <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Restaurant Settings */}
            {activeTab === "restaurant" && (
              <>
                <Card padding="lg">
                  <CardHeader>
                    <CardTitle>Operating Hours</CardTitle>
                    <CardDescription>
                      Set your restaurant working hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Opening Time"
                        type="time"
                        value={restaurantSettings.openTime}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            openTime: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Closing Time"
                        type="time"
                        value={restaurantSettings.closeTime}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            closeTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card padding="lg">
                  <CardHeader>
                    <CardTitle>Capacity & Service</CardTitle>
                    <CardDescription>
                      Configure restaurant capacity settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Total Tables"
                          type="number"
                          value={restaurantSettings.tableCount}
                          onChange={(e) =>
                            setRestaurantSettings({
                              ...restaurantSettings,
                              tableCount: parseInt(e.target.value),
                            })
                          }
                        />
                        <Input
                          label="Max Capacity"
                          type="number"
                          value={restaurantSettings.maxCapacity}
                          onChange={(e) =>
                            setRestaurantSettings({
                              ...restaurantSettings,
                              maxCapacity: parseInt(e.target.value),
                            })
                          }
                          helperText="Total guests"
                        />
                        <Input
                          label="Avg Service Time"
                          type="number"
                          value={restaurantSettings.avgServiceTime}
                          onChange={(e) =>
                            setRestaurantSettings({
                              ...restaurantSettings,
                              avgServiceTime: parseInt(e.target.value),
                            })
                          }
                          helperText="Minutes"
                        />
                      </div>

                      <div className="space-y-3 pt-4 border-t border-kot-chart">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={restaurantSettings.takeawayEnabled}
                            onChange={(e) =>
                              setRestaurantSettings({
                                ...restaurantSettings,
                                takeawayEnabled: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-kot-primary rounded"
                          />
                          <div>
                            <p className="font-medium text-kot-darker">
                              Enable Takeaway Orders
                            </p>
                            <p className="text-sm text-kot-text">
                              Allow customers to place takeaway orders
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={restaurantSettings.deliveryEnabled}
                            onChange={(e) =>
                              setRestaurantSettings({
                                ...restaurantSettings,
                                deliveryEnabled: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-kot-primary rounded"
                          />
                          <div>
                            <p className="font-medium text-kot-darker">
                              Enable Delivery Service
                            </p>
                            <p className="text-sm text-kot-text">
                              Offer home delivery to customers
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Billing Settings */}
            {activeTab === "billing" && (
              <>
                <Card padding="lg">
                  <CardHeader>
                    <CardTitle>Tax & Charges</CardTitle>
                    <CardDescription>
                      Configure tax rates and service charges
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Tax Rate (%)"
                          type="number"
                          value={billingSettings.taxRate}
                          onChange={(e) =>
                            setBillingSettings({
                              ...billingSettings,
                              taxRate: parseFloat(e.target.value),
                            })
                          }
                          helperText="GST/VAT rate"
                        />
                        <Input
                          label="Service Charge (%)"
                          type="number"
                          value={billingSettings.serviceCharge}
                          onChange={(e) =>
                            setBillingSettings({
                              ...billingSettings,
                              serviceCharge: parseFloat(e.target.value),
                            })
                          }
                          helperText="Optional service fee"
                        />
                      </div>

                      <div className="space-y-3 pt-4 border-t border-kot-chart">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={billingSettings.autoRoundOff}
                            onChange={(e) =>
                              setBillingSettings({
                                ...billingSettings,
                                autoRoundOff: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-kot-primary rounded"
                          />
                          <div>
                            <p className="font-medium text-kot-darker">
                              Auto Round Off
                            </p>
                            <p className="text-sm text-kot-text">
                              Round bill to nearest rupee
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={billingSettings.printReceipt}
                            onChange={(e) =>
                              setBillingSettings({
                                ...billingSettings,
                                printReceipt: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-kot-primary rounded"
                          />
                          <div>
                            <p className="font-medium text-kot-darker">
                              Print Receipt by Default
                            </p>
                            <p className="text-sm text-kot-text">
                              Auto print receipt after payment
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={billingSettings.emailReceipt}
                            onChange={(e) =>
                              setBillingSettings({
                                ...billingSettings,
                                emailReceipt: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-kot-primary rounded"
                          />
                          <div>
                            <p className="font-medium text-kot-darker">
                              Email Receipt
                            </p>
                            <p className="text-sm text-kot-text">
                              Send receipt to customer email
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card padding="lg">
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Enable or disable payment options
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={billingSettings.paymentMethods.cash}
                          onChange={(e) =>
                            setBillingSettings({
                              ...billingSettings,
                              paymentMethods: {
                                ...billingSettings.paymentMethods,
                                cash: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-kot-primary rounded"
                        />
                        <div>
                          <p className="font-medium text-kot-darker">Cash</p>
                          <p className="text-sm text-kot-text">
                            Accept cash payments
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={billingSettings.paymentMethods.card}
                          onChange={(e) =>
                            setBillingSettings({
                              ...billingSettings,
                              paymentMethods: {
                                ...billingSettings.paymentMethods,
                                card: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-kot-primary rounded"
                        />
                        <div>
                          <p className="font-medium text-kot-darker">
                            Credit/Debit Card
                          </p>
                          <p className="text-sm text-kot-text">
                            Accept card payments via POS
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={billingSettings.paymentMethods.upi}
                          onChange={(e) =>
                            setBillingSettings({
                              ...billingSettings,
                              paymentMethods: {
                                ...billingSettings.paymentMethods,
                                upi: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-kot-primary rounded"
                        />
                        <div>
                          <p className="font-medium text-kot-darker">UPI</p>
                          <p className="text-sm text-kot-text">
                            PhonePe, GPay, Paytm
                          </p>
                        </div>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Users & Roles */}
            {activeTab === "users" && (
              <Card padding="lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>
                        Manage staff accounts and permissions
                      </CardDescription>
                    </div>
                    <Button variant="primary">Add User</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Rahul Kumar",
                        role: "Manager",
                        email: "rahul@kot.com",
                        status: "Active",
                      },
                      {
                        name: "Priya Sharma",
                        role: "Waiter",
                        email: "priya@kot.com",
                        status: "Active",
                      },
                      {
                        name: "Amit Patel",
                        role: "Chef",
                        email: "amit@kot.com",
                        status: "Active",
                      },
                      {
                        name: "Sneha Reddy",
                        role: "Waiter",
                        email: "sneha@kot.com",
                        status: "Inactive",
                      },
                    ].map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-kot-light rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-kot-primary text-white flex items-center justify-center font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-kot-darker">
                              {user.name}
                            </p>
                            <p className="text-sm text-kot-text">
                              {user.role} • {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.status}
                          </span>
                          <Button variant="secondary">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Appearance & Display</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-kot-darker mb-2">
                        Theme
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {["light", "dark"].map((theme) => (
                          <button
                            key={theme}
                            onClick={() =>
                              setAppearanceSettings({
                                ...appearanceSettings,
                                theme,
                              })
                            }
                            className={`p-4 rounded-lg border-2 transition-colors capitalize ${
                              appearanceSettings.theme === theme
                                ? "border-kot-primary bg-kot-primary/5"
                                : "border-kot-chart hover:border-kot-primary/50"
                            }`}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-kot-darker mb-2">
                        Font Size
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {["small", "medium", "large"].map((size) => (
                          <button
                            key={size}
                            onClick={() =>
                              setAppearanceSettings({
                                ...appearanceSettings,
                                fontSize: size,
                              })
                            }
                            className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                              appearanceSettings.fontSize === size
                                ? "border-kot-primary bg-kot-primary/5"
                                : "border-kot-chart hover:border-kot-primary/50"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer pt-4 border-t border-kot-chart">
                      <input
                        type="checkbox"
                        checked={appearanceSettings.compactMode}
                        onChange={(e) =>
                          setAppearanceSettings({
                            ...appearanceSettings,
                            compactMode: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-kot-primary rounded"
                      />
                      <div>
                        <p className="font-medium text-kot-darker">
                          Compact Mode
                        </p>
                        <p className="text-sm text-kot-text">
                          Reduce spacing for more content
                        </p>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-kot-darker mb-3">
                        Alert Types
                      </h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.orderAlerts}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                orderAlerts: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-kot-primary rounded"
                          />
                          <div>
                            <p className="font-medium text-kot-darker">
                              New Order Alerts
                            </p>
                            <p className="text-sm text-kot-text">
                              Get notified when orders are placed
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.lowStockAlerts}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                lowStockAlerts: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-kot-primary rounded"
                          />
                          <div>
                            <p className="font-medium text-kot-darker">
                              Low Stock Alerts
                            </p>
                            <p className="text-sm text-kot-text">
                              Alert when inventory runs low
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.staffAlerts}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                staffAlerts: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-kot-primary rounded"
                          />
                          <div>
                            <p className="font-medium text-kot-darker">
                              Staff Activity Alerts
                            </p>
                            <p className="text-sm text-kot-text">
                              Updates on staff clock-in/out
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-kot-chart">
                      <h4 className="font-semibold text-kot-darker mb-3">
                        Delivery Methods
                      </h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                emailNotifications: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-kot-primary rounded"
                          />
                          <div>
                            <p className="font-medium text-kot-darker">
                              Email Notifications
                            </p>
                            <p className="text-sm text-kot-text">
                              Receive alerts via email
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.smsNotifications}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                smsNotifications: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-kot-primary rounded"
                          />
                          <div>
                            <p className="font-medium text-kot-darker">
                              SMS Notifications
                            </p>
                            <p className="text-sm text-kot-text">
                              Receive alerts via text message
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <div className="flex justify-end gap-3 sticky bottom-4">
              <Button variant="secondary">Reset</Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
