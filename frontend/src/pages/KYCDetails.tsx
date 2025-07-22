import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  X,
  FileText,
  MessageSquare,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiService } from "@/services/api";
import { KYCCase } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  useGetKYCCaseQuery,
  useUpdateKYCStatusMutation,
  useAddKYCNoteMutation,
} from "@/services/apiSlice";
import { getRegionLabel } from "@/utils/roleUtils";
import { Region } from "@/types";
const KYCDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [kycCase, setKycCase] = useState<KYCCase | null>(null);
  const [reason, setReason] = useState("");
  const { data, isLoading } = useGetKYCCaseQuery(id);
  const [updateKYCStatus] = useUpdateKYCStatusMutation();
  const [note, setNote] = useState(data?.reason || "");
  const [addKYCNote] = useAddKYCNoteMutation();

  useEffect(() => {
    if (data) {
      setReason(data.reason || "");
    }
  }, [data?.reason]);

  console.log(data);

  const handleAddNote = async () => {
    // if (!kycCase || !note.trim()) return;

    try {
      if (!data._id) {
        toast({
          title: "Error",
          description: "KYC case ID is missing",
          variant: "destructive",
        });
        return;
      }

      await addKYCNote({
        id: data._id,
        content: note.trim(),
        isInternal: true,
      }).unwrap();

      toast({
        title: "Note Added",
        description: "Internal note has been added to the case",
      });
      setNote("");
    } catch (error) {
      console.error("Failed to add note:", error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (status: KYCCase["status"]) => {
    try {
      const updatedCase = await updateKYCStatus({
        id: data._id,
        status: status,
        reason: reason.trim() || undefined,
      });

      toast({
        title: "Status Updated",
        description: `KYC case status has been updated to ${formatStatus(
          status
        )}`,
      });
      console.log("Updated case:", updatedCase);
    } catch (error) {
      console.log("====================================", error);
      console.error("Failed to update status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: KYCCase["status"]) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "under_review":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const formatStatus = (status: KYCCase["status"]) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/kyc")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to KYC Cases
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/kyc")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to KYC Cases
          </Button>
        </div>

        <Alert>
          <AlertDescription>KYC case not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/kyc")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to KYC Cases
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              KYC Case {data._id}
            </h1>
            <p className="text-muted-foreground">
              Review and manage verification request
            </p>
          </div>
        </div>
        <Badge variant="secondary" className={getStatusColor(data.status)}>
          {formatStatus(data.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{data.user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{data.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{data.user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Region</p>
                    <p className="font-medium">
                      {getRegionLabel(data.user.region as Region)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="font-medium">{formatDate(data.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="font-medium">{formatDate(data.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Uploaded Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.documents.id_front && (
                  <div className="border rounded-lg p-4 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">ID Front</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      asChild
                    >
                      <Link
                        to={`http://localhost:5000${data.documents.id_front}`}
                        target="_blank"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                )}
                {data.documents.id_back && (
                  <div className="border rounded-lg p-4 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">ID Back</p>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      asChild
                    >
                      <Link
                        to={`http://localhost:5000${data.documents.id_back}`}
                        target="_blank"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                )}
                {data.documents.proof_of_address && (
                  <div className="border rounded-lg p-4 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Proof of Address</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      asChild
                    >
                      <Link
                        to={`http://localhost:5000${data.documents.proof_of_address}`}
                        target="_blank"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {!data.documents.id_front &&
                !data.documents.id_back &&
                !data.documents.proof_of_address && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No documents uploaded yet
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Case Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Case Notes & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.notes.map((note) => (
                  <div
                    key={note}
                    className="border-l-4 border-primary/20 pl-4 pb-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"></div>
                    </div>
                    <p className="text-sm text-muted-foreground">{note}</p>
                  </div>
                ))}

                {data.notes.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No notes added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Status Actions</CardTitle>
              <CardDescription>Update the verification status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for status change..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleStatusUpdate("approved")}
                  disabled={isLoading || data.status === "approved"}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={isLoading || data.status === "rejected"}
                  variant="destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>

              <Button
                onClick={() => handleStatusUpdate("under_review")}
                disabled={isLoading || data.status === "pending"}
                variant="outline"
                className="w-full"
              >
                <Clock className="h-4 w-4 mr-2" />
                Mark Under Review
              </Button>
            </CardContent>
          </Card>

          {/* Add Note */}
          <Card>
            <CardHeader>
              <CardTitle>Add Internal Note</CardTitle>
              <CardDescription>
                Add a note for internal tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  placeholder="Add your internal note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={handleAddNote}
                disabled={!note.trim()}
                className="w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KYCDetails;
