import "./CompanySlider.css";

import aws from "../assets/companies/AWSLogo.png";
import catlog from "../assets/companies/CatlogLogo.png";
import google from "../assets/companies/GoogleLogo.png";
import ibm from "../assets/companies/IBMLogo.png";
import infosys from "../assets/companies/InfosysLogo.png";
import microsoft from "../assets/companies/MicrosoftLogo.png";
import ndmattix from "../assets/companies/nDMattixLogo.png";
import salesforce from "../assets/companies/SalesforceLogo.png";
import servicenow from "../assets/companies/ServicenowLogo.png";
import tcs from "../assets/companies/TCSLogo.png";
import techmahindra from "../assets/companies/TechMahindraLogo.png";
import wipro from "../assets/companies/WiproLogo.png";


function CompanySlider() {


const companies = [
 aws,
 google,
 microsoft,
 tcs,
 infosys,
 wipro,
 ibm,
 techmahindra,
 salesforce,
 servicenow,
 ndmattix,
 catlog
];


return (

<div className="company-section">


<h2>
Our Recruiting Partners
</h2>


<div className="slider">


<div className="slide-track">


{
companies.map((logo,index)=>(

<div 
className="company-card"
key={index}
>

<img src={logo}/>

</div>


))
}



{
companies.map((logo,index)=>(

<div 
className="company-card"
key={"copy"+index}
>

<img src={logo}/>

</div>


))
}


</div>


</div>


</div>

)

}


export default CompanySlider;