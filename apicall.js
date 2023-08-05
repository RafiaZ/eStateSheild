import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { shopUpdate,getShops } from "../../actions/shops";
import { shopsRegistration } from "../../actions/shops";
import { getBusinesses } from "../../actions/business";
import { useNavigate, useParams } from "react-router-dom";
import { getVendor } from "../../actions/vendor";
import { LIVE_URl } from "../../actions/types";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import { getEmails } from "../../actions/emails";
import CustomButton from "../../components/global/Button";
import { documentRegistration } from "../../actions/document";
import Icofont from "react-icofont";
import axios from "axios";
const useStyles = makeStyles({
  form: {
    padding: "10px 0",
  },
  labelCol: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    color: "#555",
    "@media (max-width: 768px)": {
      justifyContent: "start",
    },
  },
  row: {
    marginBottom: "1rem",
    textAlign: "left",
    "@media (max-width: 768px)": {
      marginBottom: "1rem !important",
    },
  },
  bottomFooter: {
    textAlign: "left",
    margin: "10px 0",
  },
  errorMsg: {
    color: "#d32f2f",
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    fontWeight: "400 !important",
    fontSize: "0.75rem !important",
    lineHeight: "1.66 !important",
    letterSpacing: "0.03333em !important",
    textAlign: "left !important",
    marginTop: "3px !important",
    marginRight: "0 !important",
    marginBottom: "0 !important",
    marginLeft: "0 !important",
  },
});
const EmailView = ({
 
  documentRegistration, 
  getShops,
  getVendor,
  getEmails,
  getBusinesses,
  vendor: { allVendors },
  shops: { allShops },
  emails: { allEmails },
  business: { allBusiness },
}) => {
 
  const navigateTo = useNavigate();
  const params = useParams();
  const classes = useStyles();
 
  const [data, setData] = useState({
    document_name: "",
    document_type: "",
    document_type_id: "",
    customer_id: "",
    vendor_id: "",
    bank_id: "",
    shop_id: "",
    bank_id:"",
    file_link: "",
    vendor:""
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteShopModal, setDeleteShopModal] = useState(false);
  const [emailData, setEmailData] = useState("");
 
  const [errors, setErrors] = useState({
    subjectErr: "",
    senderErr: "",
    date_receivedErr: "",
    contentErr: "",
    shop_idErr: "",
    document_nameErr: "",
    document_typeErr: "",
    document_type_idErr: "",
    customer_idErr: "",
    vendor_idErr: "",
    bank_idErr: "",
    
  });

  const {
    subjectErr,
    senderErr,
    date_receivedErr,
    contentErr,
    shop_idErr,
    document_nameErr,
    document_typeErr,
    document_type_idErr,
    customer_idErr,
    vendor_idErr,
    bank_idErr,
    
  } = errors;

  const loadingFunc = (key) => {
    setLoading(key);
  };
  const {
    vendor,
    document_name,
    document_type,
     vendor_id,
     customer_id,
    shop_id,
    bank_id
  } = data;
  const { email_attachments } = data;
  const [responseData, setResponseData] = useState([]);
  useEffect(() => {
    getEmails(loadingFunc);
  }, [getEmails]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await axios.get(`${LIVE_URl}/email-pipe/${params.id}`);
      setData(result?.data?.data);
      setLoading(false);
    };
    fetchData();
  }, [params.id]);


  const validate = (data) => {
    const errors = {};
    if (!data?.subject) errors.subjectErr = "Please provide  subject";
    if (!data?.sender) errors.senderErr = "Please provide sender email";
    if (!data?.date_received) errors.date_receivedErr = "Please provide date";
    if (!data?.content) errors.contentErr = "Please provide content";
    if (!document_name) {
      setErrors((prev) => ({
        ...prev,
        document_nameErr: "Please provide document name",
      }));
    }
    if (!vendor_id) {
      setErrors((prev) => ({
        ...prev,
        vendor_idErr: "Please provide vendor",
      }));
    }
    console.log(data?.content)

    if (!document_name || !vendor_id || !file_link) {
      return false;
    }
    return true;
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const onChangeFields = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const file_link = "https://pharmacy.webspider.pk/public/lexon_invoice.pdf";
  const onSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        let dataForm = new FormData();
        dataForm.append("document_name", document_name);
        dataForm.append("document_type", "Vendor");
        dataForm.append("document_type_id", vendor_id);
        dataForm.append("customer_id", customer_id);
        dataForm.append("vendor_id", vendor_id);
        dataForm.append("bank_id", bank_id);
        dataForm.append("shop_id", shop_id);
        // dataForm.append("file_link", file_link);
        if (file_link !== undefined) {
          dataForm.append("file_link",file_link );
        }
        let response = await axios.post("https://pharmacy.webspider.pk/api/v1/document", dataForm);
        console.log("responsevresponse", response);
        if (response?.status === 200) {
          setResponseData(response.data); // Set the response data to the state
          navigateTo(`/dashboard/converted/${response?.data?.data?._id}`);
          console.log(response?.data)
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        
       
        
      }
    }
  };
  
  console.log(document_name)
  console.log(document_type)
  console.log(vendor_id)
  console.log(file_link)
  console.log(documentRegistration)

  useEffect(() => {
    getBusinesses(loadingFunc);
    getVendor(loadingFunc);
    // getDocuments(loadingFunc);
    getShops(loadingFunc);
  }, [getBusinesses, getShops,getVendor]);


  const openDeleteShopModal = (data) => {
    setEmailData(data);
    setDeleteShopModal(true);
  };
  const closeDeleteShopModal = () => setDeleteShopModal(false);
  const handleChangeShopEmail = (e) => {
    if (!/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/.test(e.target.value)) {
      setErrors((prev) => ({
        ...prev,
        Date_Err: e.target.value
          ? "Invalid email address"
          : "Email can't be empty",
      }));
      setData((prev) => ({ ...prev, sender: e.target.value }));
    } else {
      setData((prev) => ({ ...prev, sender: e.target.value }));
      setErrors((prev) => ({ ...prev, Date_Err: "" }));
    }
  };


  return (
    <>
      <header className="my-3">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <h1 className="s-24">
                <i className="icon-pages"></i>
                Email View <span className="s-14">Registration Number</span>
              </h1>
            </div>
          </div>
        </div>
      </header>
      <div className="animatedParent animateOnce">
        <div className="container-fluid my-3">
          <div className="row">
          <div className="col-md-7">
                <div className="card">
                  <div className="card-body b-b">
                    <form className="form-material">
                      <div className="body">
                        <div className="row clearfix">
                          <div className="col-sm-12">
                           

                            <div className="form-group">
                              <div className="form-line">
                                <input
                                  type="text"
                                  name="sender"
                                  value={data?.sender}
                                  onChange={(e) => handleChangeShopEmail(e)}
                                  className="form-control"
                                  placeholder="Sender"
                                  required="required"
                                />
                              </div>
                              {senderErr && (
                                <p className="text-danger">{senderErr}</p>
                              )}
                            </div>
                            <div className="form-group">
                              <div className="form-line">
                                <input
                                  type="text"
                                  name="subject"
                                  value={data?.subject}
                                  onChange={(e) => {
                                    onChangeFields(e);
                                    setErrors((prev) => ({
                                      ...prev,
                                      subjectErr: "",
                                    }));
                                  }}
                                  className="form-control"
                                  placeholder="Subject"
                                />
                              </div>
                              {subjectErr && (
                                <p className="text-danger">{subjectErr}</p>
                              )}
                            </div>
                          
                            <div className="form-group">
                              <div className="form-line">
                                <input
                                  type="text"
                                  name="date"
                                  value={data?.date_received}
                                  onChange={(e) => {
                                    onChangeFields(e);
                                    setErrors((prev) => ({
                                      ...prev,
                                      date_receivedErr: "",
                                    }));
                                  }}
                                  className="form-control"
                                  placeholder="Date"
                                  required="required"
                                />
                              </div>
                              {date_receivedErr && (
                                <p className="text-danger">{date_receivedErr}</p>
                              )}
                            </div>
                       <div className="form-group">
                              <div className="form-line">
                                <textarea
                                  type="text"
                                  name="content"
                                  value={data?.content}
                                  onChange={(e) => {
                                    onChangeFields(e);
                                    setErrors((prev) => ({
                                      ...prev,
                                      contentErr: "",
                                    }));
                                  }}
                                  className="form-control"
                                  placeholder="Content"
                                  required="required"
                                />
                              </div>
                              {contentErr && (
                                <p className="text-danger">{contentErr}</p>
                              )}
                            </div>

                            <div className="form-group">
                              <div className="form-line">
                              <label> Select an Document  type</label>
                              <div className="select">
              <select
                name="document_type"
    
                className="custom-select form-control"
                value={document_type}
                required="required"
                onChange={(e) => {
                  onChangeFields(e);
                }}
              >
            
                <option value="App\Models\Vendor" selected>Invoice</option>
                <option value="App\Models\Customer">Statement</option>
                <option value="App\Models\Bank">Sale</option>
              </select>
             
            </div>
                              </div>
                            
                            </div>
                          
                            <div className="form-group">
                              <div className="form-line">
                            <input
                             
                              type="text"
                              name="document_name"
                              value={document_name}
                              onChange={(e) => {
                                onChangeFields(e);
                                setErrors((prev) => ({
                                  ...prev,
                                  document_nameErr: "",
                                }));
                              }}
                              className="form-control"
                              placeholder="Document name"
                            />
                           
                            </div>
                            {document_nameErr && (
                              <Typography className={classes.errorMsg}>
                                {document_nameErr}
                              </Typography>
                            )}
                            </div>
                        
                          <div className="form-group">
                              <div className="form-line">
                            <div className="select">
                              <select
                                name="vendor_id"
                              
                                className="custom-select form-control"
                                value={vendor_id}
                                required="required"
                                onChange={(e) => {
                                  onChangeFields(e);
                                  setErrors((prev) => ({
                                    ...prev,
                                    vendor_idErr: "",
                                  }));
                                }}
                              >
                                <option value="" disabled={true}>
                                  Select an vendor
                                </option>
                                {allVendors?.map((data, i) => (
                                  <option value={data?._id} key={i}>
                                    {data?.name}
                                  </option>
                                ))}
                              </select>
                             
                            </div>
                           
                            </div>
                            {vendor_idErr && (
                                <Typography className={classes.errorMsg}>
                                  {vendor_idErr}
                                </Typography>
                              )}
                            </div>

                            
                           
                            
                          </div>
                          
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            <div className="col-md-5">
            <section >
            <div className="row">
              <div className="col-lg-12">
                <div className="box">
                  <div className="box-header">
                    <h5 className="text-left">Attachments</h5>
                  </div>
                  <table className="table">
                  <tbody>
                          <tr>
                          <th style={{ width: "10px" }}>Attachment</th>
                            <th className="text-right">Status</th>
                             <th style={{ width: "160px" }}>Action</th>
                          </tr>
                          {email_attachments?.map((attachment, i) => (
                            <tr key={attachment._id}>
                             <Link
                              to={attachment.file_path}
                                ><td>Document{i + 1} </td></Link>  
                             
                              <td class="text-right">
                                    <i class="icon icon-remove text-danger"> </i>
                                </td>
                                <Link
                              to={`/dashboard/converted/${responseData?._id}`}
                                >
                                  
                                    <td class="text-right "   onClick={onSubmit}
                                    >
                                        <span class="badge badge-success" >processing</span>
                                    </td>
                             </Link>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                 
                </div>
              </div>
            </div>
          </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

EmailView.propTypes = {
  documentRegistration: PropTypes.func.isRequired,
  shopsRegistration: PropTypes.func.isRequired,
  getBusinesses: PropTypes.func.isRequired,
  shops: PropTypes.object.isRequired,
  getShops: PropTypes.func.isRequired,
  business: PropTypes.object.isRequired,
  emails: PropTypes.object.isRequired,
  shopUpdate: PropTypes.func.isRequired,
  getVendor: PropTypes.func.isRequired,
  getEmails: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    emails: state.emails,
  shops: state.shops,
  business: state.business,
  vendor: state.vendor,
});

export default connect(mapStateToProps, {
  getShops,
  getVendor,
  shopUpdate,
  getEmails,
  shopsRegistration,
  getBusinesses,
  documentRegistration,
})(EmailView);