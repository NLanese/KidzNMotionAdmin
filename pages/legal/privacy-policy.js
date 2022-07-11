import React from "react";
import styled from "styled-components";
import ContentCard from "@common/content/ContentCard";
import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
import BasicLink from "@common/BasicLink";

const PrivacyPolicyWrapper = styled.div`
  background: ${(props) => props.theme.colors.backgroundColor};
  min-height: 100vh;
`;

const PrivacyPolicyInnerWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.tight};
  margin: auto;
  background: ${(props) => props.theme.colors.backgroundColor};
  padding: 40px 20px;
  & img {
    text-align: center;
    margin: auto;
    display: block;
    width: 110px;
    margin-bottom: 30px;
  }
`;

function PrivacyPolicy() {
  return (
    <PrivacyPolicyWrapper>
      <NextSeo title="Privacy Policy" />
      <PrivacyPolicyInnerWrapper>
        <BasicLink href="/">
          <img alt="Tom App Logo" src="/logos/LogoSVG.svg" />
        </BasicLink>
        <PageHeader title="Privacy Policy" />
        <ContentCard>
          <p>
            We respect your privacy and are committed to protecting it through
            our compliance with this privacy policy (“Policy”). This Policy
            describes the types of information we may collect from you or that
            you may provide (“Personal Information”) on the thetomapp.com
            website (“Website”), “The TOM App” mobile application (“Mobile
            Application”), and any of their related products and services
            (collectively, “Services”), and our practices for collecting, using,
            maintaining, protecting, and disclosing that Personal Information.
            It also describes the choices available to you regarding our use of
            your Personal Information and how you can access and update it. This
            Policy is a legally binding agreement between you (“User”, “you” or
            “your”) and The TOM App LLC (“The TOM App LLC”, “we”, “us” or
            “our”). If you are entering into this agreement on behalf of a
            business or other legal entity, you represent that you have the
            authority to bind such entity to this agreement, in which case the
            terms “User”, “you” or “your” shall refer to such entity. If you do
            not have such authority, or if you do not agree with the terms of
            this agreement, you must not accept this agreement and may not
            access and use the Services. By accessing and using the Services,
            you acknowledge that you have read, understood, and agree to be
            bound by the terms of this Policy. This Policy does not apply to the
            practices of companies that we do not own or control, or to
            individuals that we do not employ or manage.
          </p>
          <h4>Information Collection and Use</h4>
          <p>
            You can access and use the Services without telling us who you are
            or revealing any information by which someone could identify you as
            a specific, identifiable individual. If, however, you wish to use
            some of the features offered on the Services, you may be asked to
            provide certain Personal Information (for example, your name and
            e-mail address). We receive and store any information you knowingly
            provide to us when you create an account, or fill any forms on the
            Services. When required, this information may include the following:
          </p>
          <p>
            Account details (such as user name, unique user ID, password, etc)
            Contact information (such as email address, phone number, etc) Basic
            personal information (such as name, country of residence, etc)
            Payment information (such as credit card details, bank details, etc)
            Geolocation data of your device (such as latitude and longitude)
            Certain features on the mobile device (such as contacts, calendar,
            gallery, etc) Any other materials you willingly submit to us (such
            as articles, images, feedback, etc) You can choose not to provide us
            with your Personal Information, but then you may not be able to take
            advantage of some of the features on the Services. Users who are
            uncertain about what information is mandatory are welcome to contact
            us.
          </p>
          <h4>Privacy of children</h4>
          <p>
            We do not knowingly collect any Personal Information from children
            under the age of 13. If you are under the age of 13, please do not
            submit any Personal Information through the Services. If you have
            reason to believe that a child under the age of 13 has provided
            Personal Information to us through the Services, please contact us
            to request that we delete that child’s Personal Information from our
            Services. We encourage parents and legal guardians to monitor their
            children’s Internet usage and to help enforce this Policy by
            instructing their children never to provide Personal Information
            through the Services without their permission. We also ask that all
            parents and legal guardians overseeing the care of children take the
            necessary precautions to ensure that their children are instructed
            to never give out Personal Information when online without their
            permission.
          </p>
          <h4>Use and processing of collected information</h4>
          <p>
            We act as a data controller and a data processor when handling
            Personal Information, unless we have entered into a data processing
            agreement with you in which case you would be the data controller
            and we would be the data processor. Our role may also differ
            depending on the specific situation involving Personal Information.
            We act in the capacity of a data controller when we ask you to
            submit your Personal Information that is necessary to ensure your
            access and use of the Services. In such instances, we are a data
            controller because we determine the purposes and means of the
            processing of Personal Information. We act in the capacity of a data
            processor in situations when you submit Personal Information through
            the Services. We do not own, control, or make decisions about the
            submitted Personal Information, and such Personal Information is
            processed only in accordance with your instructions. In such
            instances, the User providing Personal Information acts as a data
            controller. In order to make the Services available to you, or to
            meet a legal obligation, we may need to collect and use certain
            Personal Information. If you do not provide the information that we
            request, we may not be able to provide you with the requested
            products or services. Any of the information we collect from you may
            be used for the following purposes:
          </p>
          <p>
            Create and manage user accounts Deliver products or services Request
            user feedback Improve user experience Enforce terms and conditions
            and policies Protect from abuse and malicious users Run and operate
            the Services
          </p>
          <p>
            Processing your Personal Information depends on how you interact
            with the Services, where you are located in the world and if one of
            the following applies: (i) you have given your consent for one or
            more specific purposes; this, however, does not apply, whenever the
            processing of Personal Information is subject to California Consumer
            Privacy Act; (ii) provision of information is necessary for the
            performance of an agreement with you and/or for any pre-contractual
            obligations thereof; (iii) processing is necessary for compliance
            with a legal obligation to which you are subject; (iv) processing is
            related to a task that is carried out in the public interest or in
            the exercise of official authority vested in us; (v) processing is
            necessary for the purposes of the legitimate interests pursued by us
            or by a third party. Note that under some legislations we may be
            allowed to process information until you object to such processing
            by opting out, without having to rely on consent or any other of the
            legal bases. In any case, we will be happy to clarify the specific
            legal basis that applies to the processing, and in particular
            whether the provision of Personal Information is a statutory or
            contractual requirement, or a requirement necessary to enter into a
            contract.
          </p>
          <h4>Managing information</h4>
          <p>
            You are able to delete certain Personal Information we have about
            you. The Personal Information you can delete may change as the
            Services change. When you delete Personal Information, however, we
            may maintain a copy of the unrevised Personal Information in our
            records for the duration necessary to comply with our obligations to
            our affiliates and partners, and for the purposes described below.
          </p>
          <h4>Disclosure of information</h4>
          <p>
            Depending on the requested Services or as necessary to complete any
            transaction or provide any Service you have requested, we may share
            your information with our affiliates, contracted companies, and
            service providers (collectively, “Service Providers”) we rely upon
            to assist in the operation of the Services available to you and
            whose privacy policies are consistent with ours or who agree to
            abide by our policies with respect to Personal Information. We will
            not share any personally identifiable information with third parties
            and will not share any information with unaffiliated third parties.
            Service Providers are not authorized to use or disclose your
            information except as necessary to perform services on our behalf or
            comply with legal requirements. Service Providers are given the
            information they need only in order to perform their designated
            functions, and we do not authorize them to use or disclose any of
            the provided information for their own marketing or other purposes.
            We will share and disclose your information only with the following
            categories of Service Providers: Cloud computing services Data
            storage services Website hosting service providers
          </p>
          <h4>Retention of information</h4>
          <p>
            We will retain and use your Personal Information for the period
            necessary to comply with our legal obligations, as long as your user
            account remains active, until our and our affiliates and partners
            obligations are fulfilled, to enforce our agreements, resolve
            disputes, and unless a longer retention period is required or
            permitted by law. We may use any aggregated data derived from or
            incorporating your Personal Information after you update or delete
            it, but not in a manner that would identify you personally. Once the
            retention period expires, Personal Information shall be deleted.
            Therefore, the right to access, the right to erasure, the right to
            rectification, and the right to data portability cannot be enforced
            after the expiration of the retention period.
          </p>
          <h4>California privacy rights</h4>
          <p>
            Consumers residing in California are afforded certain additional
            rights with respect to their Personal Information under the
            California Consumer Privacy Act (“CCPA”). If you are a California
            resident, this section applies to you. As described in this Policy
            in the information collection section above, we have collected the
            categories of Personal Information listed below in the past twelve
            (12) months: Personal identifiers (such as email address, phone
            number, etc) Person’s characteristics (such as age, gender, etc) In
            addition to the rights as explained in this Policy, California
            residents who provide Personal Information as defined in the statute
            to obtain Services for personal, family, or household use are
            entitled to request and obtain from us, once a calendar year,
            information about the categories and specific pieces of Personal
            Information we have collected and disclosed. Furthermore, California
            residents have the right to request deletion of their Personal
            Information or opt-out of the sale of their Personal Information
            which may include selling, disclosing, or transferring Personal
            Information to another business or a third party for monetary or
            other valuable consideration. To do so, simply contact us. We will
            not discriminate against you if you exercise your rights under the
            CCPA.
          </p>
          <h4>How to exercise your rights</h4>
          <p>
            Any requests to exercise your rights can be directed to us through
            the contact details provided in this document. Please note that we
            may ask you to verify your identity before responding to such
            requests. Your request must provide sufficient information that
            allows us to verify that you are the person you are claiming to be
            or that you are the authorized representative of such person. If we
            receive your request from an authorized representative, we may
            request evidence that you have provided such an authorized
            representative with power of attorney or that the authorized
            representative otherwise has valid written authority to submit
            requests on your behalf. You must include sufficient details to
            allow us to properly understand the request and respond to it. We
            cannot respond to your request or provide you with Personal
            Information unless we first verify your identity or authority to
            make such a request and confirm that the Personal Information
            relates to you.
          </p>
          <h4>Do Not Track signals</h4>
          <p>
            Some browsers incorporate a Do Not Track feature that signals to
            websites you visit that you do not want to have your online activity
            tracked. Tracking is not the same as using or collecting information
            in connection with a website. For these purposes, tracking refers to
            collecting personally identifiable information from consumers who
            use or visit a website or online service as they move across
            different websites over time. How browsers communicate the Do Not
            Track signal is not yet uniform. As a result, the Services are not
            yet set up to interpret or respond to Do Not Track signals
            communicated by your browser. Even so, as described in more detail
            throughout this Policy, we limit our use and collection of your
            Personal Information.
          </p>
          <h4>Advertisements</h4>
          <p>
            We may permit certain third-party companies to help us tailor
            advertising that we think may be of interest to Users and to collect
            and use other data about User activities on the Services. These
            companies may deliver ads that might place cookies and otherwise
            track User behavior.
          </p>
          <h4>Push notifications</h4>
          <p>
            We offer push notifications to which you may voluntarily subscribe
            at any time. To make sure push notifications reach the correct
            devices, we use a third-party push notifications provider who relies
            on a device token unique to your device which is issued by the
            operating system of your device. While it is possible to access a
            list of device tokens, they will not reveal your identity, your
            unique device ID, or your contact information to us or our
            third-party push notifications provider. We will maintain the
            information sent via e-mail in accordance with applicable laws and
            regulations. If, at any time, you wish to stop receiving push
            notifications, simply adjust your device settings accordingly.
          </p>
          <h4>Links to other resources</h4>
          <p>
            The Services contain links to other resources that are not owned or
            controlled by us. Please be aware that we are not responsible for
            the privacy practices of such other resources or third parties. We
            encourage you to be aware when you leave the Services and to read
            the privacy statements of each and every resource that may collect
            Personal Information.
          </p>
          <h4>Information security</h4>
          <p>
            We secure information you provide on computer servers in a
            controlled, secure environment, protected from unauthorized access,
            use, or disclosure. We maintain reasonable administrative,
            technical, and physical safeguards in an effort to protect against
            unauthorized access, use, modification, and disclosure of Personal
            Information in our control and custody. However, no data
            transmission over the Internet or wireless network can be
            guaranteed. Therefore, while we strive to protect your Personal
            Information, you acknowledge that (i) there are security and privacy
            limitations of the Internet which are beyond our control; (ii) the
            security, integrity, and privacy of any and all information and data
            exchanged between you and the Services cannot be guaranteed; and
            (iii) any such information and data may be viewed or tampered with
            in transit by a third party, despite best efforts. As the security
            of Personal Information depends in part on the security of the
            device you use to communicate with us and the security you use to
            protect your credentials, please take appropriate measures to
            protect this information.
          </p>
          <h4>Data breach</h4>
          <p>
            In the event we become aware that the security of the Services has
            been compromised or Users’ Personal Information has been disclosed
            to unrelated third parties as a result of external activity,
            including, but not limited to, security attacks or fraud, we reserve
            the right to take reasonably appropriate measures, including, but
            not limited to, investigation and reporting, as well as notification
            to and cooperation with law enforcement authorities. In the event of
            a data breach, we will make reasonable efforts to notify affected
            individuals if we believe that there is a reasonable risk of harm to
            the User as a result of the breach or if notice is otherwise
            required by law. When we do, we will post a notice on the Services,
            send you an email.
          </p>
          <h4>Changes and amendments</h4>
          <p>
            We reserve the right to modify this Policy or its terms related to
            the Services at any time at our discretion. When we do, we will
            revise the updated date at the bottom of this page, post a
            notification within the Services. We may also provide notice to you
            in other ways at our discretion, such as through the contact
            information you have provided. An updated version of this Policy
            will be effective immediately upon the posting of the revised Policy
            unless otherwise specified. Your continued use of the Services after
            the effective date of the revised Policy (or such other act
            specified at that time) will constitute your consent to those
            changes. However, we will not, without your consent, use your
            Personal Information in a manner materially different than what was
            stated at the time your Personal Information was collected.
          </p>
          <h4>Acceptance of this policy</h4>
          <p>
            You acknowledge that you have read this Policy and agree to all its
            terms and conditions. By accessing and using the Services and
            submitting your information you agree to be bound by this Policy. If
            you do not agree to abide by the terms of this Policy, you are not
            authorized to access or use the Services.
          </p>
          <h4>Contacting us</h4>
          <p>
            If you have any questions, concerns, or complaints regarding this
            Policy, the information we hold about you, or if you wish to
            exercise your rights, we encourage you to contact us using the
            details below: nick@kingwillystudios.com
            TheOperationsManager@outlook.com We will attempt to resolve
            complaints and disputes and make every reasonable effort to honor
            your wish to exercise your rights as quickly as possible and in any
            event, within the timescales provided by applicable data protection
            laws. This document was last updated on June 3, 2022
          </p>
        </ContentCard>
      </PrivacyPolicyInnerWrapper>
    </PrivacyPolicyWrapper>
  );
}

export default PrivacyPolicy;
