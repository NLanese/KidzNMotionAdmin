import React from "react";
import styled from "styled-components";
import { Col, Row, Typography, Divider, Button, Popover } from "antd";
import { NextSeo } from "next-seo";
import PageHeader from "@common/PageHeader";
import ContentCard from "@common/content/ContentCard";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { userState } from "@atoms";
const { Title, Text } = Typography;
import BasicLink from "@common/BasicLink";

import Support1 from "../../public/support/1.png";
import Support2 from "../../public/support/2.png";
import Support3 from "../../public/support/3.png";
import Support4 from "../../public/support/4.png";

import Image from "next/image";

const SupportArticleWrapper = styled.div`
  max-width: ${(props) => props.theme.contentSize.extraTight};
  margin: auto;
  & h2 {
    text-align: left;
    font-weight: 800 !important;
    font-size: 20px !important;
    margin-bottom: 8px;
  }
  .ant-typography {
    font-size: 19px;
    line-height: 39px;
    display: block;
  }
`;

function CSV({ children }) {
  return (
    <Popover
      content={
        <div style={{ maxWidth: "200px" }}>
          A CSV(comma-separated values) file is a text file that has a specific
          format which allows data to be saved in a table structured format.
        </div>
      }
      title="What is a CSV?"
    >
      <div
        style={{
          display: "inline",
          color: "orange",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {children}
      </div>
    </Popover>
  );
}

function Support() {
  const user = useRecoilValue(userState);
  const router = useRouter();

  const renderContent = () => {
    const pages = {
      intro: {
        title: "Intro to Kidz-N-Motion",
        content: (
          <>
            <Text>
              {user.role === "GUARDIAN"
                ? `Kidz-N-Motion is a physical therapy platform that offers an easy-to-operate approach with helping disabled children. We have done this by launching a user-friendly app aimed at improving functional mobility, strength, balance, and coordination through simple physical therapy activities. The app uses animated videos with a gamified way to address gross motor skills. The app could be utilized by therapists, parents, and children with disabilities. As a parent/child user, you have specific activities recommended by your therapist to practice. You can send a message within the app to your therapist about your child’s care. And you can request an appointment with your therapist all through the app.
`
                : `  Kidz-N-Motion app is a therapy tool that helps physical therapists
              manage their patients more efficiently, effectively and allows for
              parents to engage in their child's development. A therapist can
              document a baseline assessment, upload a video clip of the child
              performing the movements, and document a status report all through
              the app! Therapists will be able to give assignments for home
              exercise programs or schedule meetings with clients (in-person or
              remotely) via both the Kidz-N-Motion Web Application as well as
              the Mobile App.`}
              <br />
              <br />
              For parents, we understand how hard it is to track your child's
              progress. This gives you control by allowing you to have direct
              access to communicate with your child’s therapist and home
              exercise programs right at your fingertips. Child users have a
              gamified app that assists them in achieving their gross motor
              goals. There are a few options to add users to the Kidz-N-Motion
              Platform. These options will be available on our website, and
              individual user invites will be available on the mobile app.
            </Text>
          </>
        ),
      },
      "request-meeting": {
        title: "Requesting Meeting",
        content: (
          <Text>
            Please keep in mind that on the Kidz-N-Motion website is where the
            meetings are managed. Clicking on the ‘Meetings’ sub header will
            allow the user to request meetings, through the button on the top
            right of your screen. From here, all presently scheduled meetings
            and assignments can be viewed. Click, ‘Request meeting’ to allow the
            user to request more meetings. Upon clicking ‘Request meeting,’ a
            modal will produce a time, a date, and for clients to schedule the
            type of meeting, ‘Virtual or In-Person meeting.’
            <br />
            <br />
            On the mobile app, login then click on the avatar to get to
            settings. Under settings, click ‘Request a Meeting” to request a
            meeting with the therapist. A modal will produce a time, a date, and
            ‘Virtual or In-Person meeting.’ The displayed date is a button that
            when pressed, will open a date / time picker. These pickers will
            allow you to select the date or time desired.
          </Text>
        ),
      },
      documentation: {
        title: "Documentation",
        content: (
          <>
            <Text>
              To effectively monitor and track patients' outcomes, documentation
              is vital for the therapist. On the Kidz-N-Motion app, tracking
              your patients' progress is done via a status report. Therapists
              can document after initially assessing a child’s ability to
              perform the skills modeled in the videos. The videos can also be a
              tool used for treatment. The app allows you to upload a clip of
              the child performing each of those movements to show visual
              documentation of their baseline function. Then when you reassess
              the child, there is evidence to support progress and effectiveness
              of the treatment. Kidz-N-Motion app affords therapists the
              convenience of recording comments on their phone to simply print
              them later through the web portal. On the web portal, generating a
              PDF document will produce a status report with comments entered in
              each comment section. In order to complete other pertinent
              information on the template document, Adobe software is required
              on the device. The platform also allows a child to earn game
              badges. Questions will appear after a video is completed. Based on
              the responses to the questions a game badge is awarded.
            </Text>
            <br />
            <br />
            <Text style={{ weight: 700 }}>
              <b>The questions are as follows:</b>{" "}
            </Text>
            <Text>
              Did you give any instruction or physical support to complete this
              video? Did the child need to stop at any point to take a break?
              How many seconds of the video were they able to successfully do,
              less than 30 seconds, less than a minute or 1 full minute?
            </Text>
            <br />
            <br />
            <Text>
              <b>Game badge criteria:</b>{" "}
            </Text>
            <Text>
              Gold: performs the task independently, for 1 min, without a rest
              period
              <br />
              Bronze: performs the task with verbal cues, for 1 min, with or
              without rest period
              <br />
              Silver: performs task with physical assist, for at least 30
              seconds, with or without rest periods
              <br />
              <br />
              To create comments for documentation on the mobile app, go to
              ‘Clients,’ then select a client and click ‘Documentation and
              Comments’ to make comments that can be downloaded from the web
              portal.
            </Text>
          </>
        ),
      },
      "message-therapist": {
        title: "Message Therapist",
        content: (
          <>
            <Text>
              Messaging is remarkably simple with Kidz-N-Motion.
              Guardians/Parents will have a chat per therapist, meaning if they
              have two or more kids with a therapist, you will have two or more
              chat rooms. Users with one child in the network will only have one
              chat room with that child’s therapist. On the website, after
              logging into the portal, messaging can be found on the left column
              of the homepage.
              <br />
              <br />
              On the mobile application, upon sign-in users will see a button
              that says ‘Messaging.’ If you only have a chatroom with one
              therapist, it will bring you right to that chat. For users with
              numerous chat rooms, they will be directed to a feed of all their
              different conversations. From here, users will be able to select
              the conversation they wish to access.
            </Text>
          </>
        ),
      },
      "access-assigned-videos": {
        title: "Access Assigned Videos",
        content: (
          <>
            <Text>
              On the mobile app, login then click ‘Videos’ to access all
              assigned videos. You will also see an indication on your calendar
              of a new video assignment. Click on ‘View all’ on the bottom of
              the calendar page. Then select the assignment to view the verbal
              description of the assigned videos.
              <br />
              <br />
              On the website, login then click ‘Assigned videos’ from the menu
              on the left side of the screen to access all assigned videos.
            </Text>
          </>
        ),
      },
      "billing-and-subscriptions": {
        title: "Billing And Subscriptions",
        content: (
          <>
            <Text>
              Access to Kidz-N-Motion is through a monthly or annual
              subscription. There are three affordable subscription categories.
              The first category is the parent plan. A parent joining
              Kidz-N-Motion with a therapist link has a free subscription while
              under the care and supervision of a physical therapist. If a
              parent joins the platform without a therapist link, the monthly
              subscription will be $25/ month.{" "}
              <b>
                It is recommended to consult with a medical professional before
                initiating an exercise plan.{" "}
              </b>
              The next category is a therapist plan. The therapist plan is
              designed for small to mid size organizations consisting of 1-15
              therapists. The therapist plan subscription is $30 monthly per
              therapist.The final category is the organization plan. The
              organization plan is designed for a large organization consisting
              of 16+ therapists. The organization plan subscription is $25
              monthly per therapist.
            </Text>
          </>
        ),
      },
      "invite-team-members": {
        title: "Invite Team Members",
        content: (
          <Text>
            Inviting therapists to the platform for your organization is like
            inviting clients/patients. Through the Kidz-N-Motion online portal,
            organizations and therapists alike will be able to send user invites
            via a <CSV>.CSV </CSV> file upload , in addition to the manual
            sign-up method. The user invites will be linked with your company
            code.
          </Text>
        ),
      },
      "status-reports": {
        title: "Status Reports",
        content: (
          <Text>
            On the web portal, creating a status report from the patient list
            can be accessed after logging in. Select ‘Patient list,’ which will
            lead to ‘Manage Patients’ screen. Click the pencil next to the
            client/patient’s name that you would like to create a document.
            Clicking the pencil will lead to a page that will allow the
            therapist user to edit basic information and to generate a PDF
            document. To comment on the platform, click on ‘Video detail’ to
            comment on a specific video and under the care plan comment tab.
            When all desired comments are recorded, then click ‘Generate PDF
            document.’ A downloadable document will be generated to download to
            your device or printed.
          </Text>
        ),
      },
      "organizational-settings": {
        title: "Organizational Settings",
        content: (
          <Text>
            If you are an organization with both clients and therapists to
            manage, Kidz-N-Motion has made it easier to manage both.
            Organizational settings can be accessed from the menu on the home
            page after logging in. Click on ‘Settings and Support’ to reveal the
            drop-down menu. Clicking ‘Organizational settings’ allows your
            company information to be added into the platform.
          </Text>
        ),
      },
      "manage-chatrooms": {
        title: "Manage Chatrooms",
        content: (
          <Text>
            Chat Rooms are remarkably simple with Kidz-N-Motion.
            Guardians/Parents will have a chat per therapist, meaning if they
            have two or more kids with a therapist, they will have two or more
            chat rooms. Users with one child in the network will only have one
            chat room with that child’s therapist.
            <br />
            <br />
            On the mobile application, upon sign-in users will see a button that
            says ‘Messaging.’ If you only have a chatroom with one therapist, it
            will bring you right to that chat. For users with numerous chat
            rooms, they will be directed to a feed of all their different
            conversations. From here, users will be able to select the
            conversation they wish to access. On the website, after logging into
            the portal, messaging can be found on the left column of the
            homepage.
          </Text>
        ),
      },
      "create-assignments": {
        title: "Create Assignments",
        content: (
          <Text>
            Creating a video assignment is determined by clinical judgment of a
            child’s functional level. Depending on the child’s functional level,
            a therapist may choose to use videos from level 1 and/or 2. Level 1
            videos are geared toward lower functioning children. Low functioning
            could range from a child that is wheelchair dependent to the child
            that has the capacity to stand and take limited steps with some
            support or supervision. Level 2 videos are geared toward higher
            functioning children. Higher functioning could range from beginning
            ambulators to children with the capacity to learn to jump or hop.
            <br />
            <br />
            <a href="/templates/users/user-report.docx" target="_blank">
              Download A Sample Assignment Report
            </a>
            <br />
            <br />
            Upon sign-in to the mobile app, a therapist user will be able to
            press the ‘Scheduling’ button. From here, all the presently
            scheduled meetings and assignments can be viewed. Click, ‘Create New
            Assignment’ to allow the user to assign videos to a specific client
            or a group of clients at the same time. After clicking ‘Create New
            Assignment,’ a modal will produce the start and end date for the
            assignment. Next, the drop down displays the list of clients and
            videos available to assign.
            <br />
            <br />
            On the web portal, creating an assignment from the patient list can
            be accessed after logging in. Select ‘Patient list,’ which will lead
            to ‘Manage Patients’ screen. Click the pencil next to the
            client/patient’s name that you would like to create an assignment.
            Clicking the pencil will lead to a page that will allow the
            therapist user to create an assignment, edit basic information and
            the option to generate a PDF document.
            <br />
          </Text>
        ),
      },

      "upload-patients": {
        title: "Patient Bulk Imports",
        content: (
          <>
            <Text>
              If you are a school or facility that needs to add both therapists
              and students, it can be easily done. Through the Kidz-N-Motion
              online portal, organizations and therapists alike will be able to
              send user invites via a <CSV>.CSV </CSV> file upload , in addition
              to the manual sign-up method. This means that a properly compiled
              spreadsheet can be submitted to send invites to a large number of
              users at once. An example of this spreadsheet is available for
              download. The excel sheet has two cells labeled, email and role
              (guardian, administrator, therapist) to fill in for submission.
            </Text>
            <br />
            <br />
            <Text style={{ weight: 700 }}>
              {" "}
              <b>Steps To Perform a Bulk Upload</b>
            </Text>
            <Text>
              1. After logging in, click patients. Then click{" "}
              <BasicLink href="/users/upload" target="_blank">
                upload patients
              </BasicLink>
              .
            </Text>
            <Image src={Support1} />
            <Text>
              2. Next, click{" "}
              <a
                href="/templates/users/USER_UPLOAD_TEMPLATE.csv"
                target="_blank"
              >
                Download template
              </a>
              . An excel spread sheet with two columns designated for the email
              and user role will appear. Complete the form with each users email
              and role,guardian, user or administrator.
            </Text>
            <Image src={Support2} />
            <Text>
              3. Save the document. Click upload file to attach the saved
              document. Then click, upload and continue to review the
              information.
            </Text>
            <Image src={Support3} />
            <Text>
              4. Review the information uploaded for accuracy. Then click bulk
              upload
            </Text>
            <Image src={Support4} />
          </>
        ),
      },
      "create-meetings": {
        title: "Create Meetings",
        content: (
          <Text>
            On the mobile application, creating meetings or assignments works
            identically. Upon sign-in, a therapist user will be able to press
            the ‘Scheduling’ button. From here, all the presently scheduled
            meetings and assignments can be viewed. Click, ‘Create New Meeting’
            to allow the user to schedule more meetings. Upon clicking ‘Create
            New Meeting,’ a modal will produce a time, a date, and clients to
            schedule as well as the type of meeting, ‘Virtual or In-Person
            meeting.’ The displayed date is a button that when pressed, will
            open a date / time picker. These pickers will allow users to select
            the date or time desired.
            <br />
            <br />
            Please keep in mind that on the Kidz-N-Motion website is where the
            meetings are managed. Clicking on the ‘Meetings’ sub header will
            allow the user to schedule/request meetings, through the button on
            the top right of your screen. If the guardian/parent requests a
            meeting, the therapist will be able to locate the meeting requested
            under their list of meetings. The therapist then clicks on the title
            of the meeting to open a box that will allow the meeting to be
            approved or declined. Similarly, to the mobile app, you will be able
            to determine the time, the date, and whether the meeting should be
            virtual or in person. If the therapist schedules a meeting, the
            guardian must follow the same steps to approve or decline the
            meeting. The therapist and guardian can also cancel a meeting as
            well as mark the meeting complete by clicking on the title of the
            meeting.
          </Text>
        ),
      },
      "invite-patients": {
        title: "Invite Patients",
        content: (
          <Text>
            Getting started on the mobile app is easy. It begins with adding
            clients or therapists by invitation. If you are a therapist or
            administrative user, login to their mobile application and press the
            ‘clients’ button. Then enter an email address as well as a
            functionality level. This functionality level dictates what videos
            are available to view. The email field should be for the child’s
            guardian, as their sign-up will create an account for their child
            automatically. Once the information is completely filled out, hit
            the ‘Add Client’ button and that user will receive an email to sign
            up for Kidz-N-Motion. It is recommended that a therapist user
            completes the set-up of a patient on the website. The link sent to
            the Guardian/parent is their option to complete in order to have
            digital access to communicate with the therapist, request to
            schedule a meeting and review assigned activities. Based on the
            information filled out by the Therapist or Admin, the client will
            have some sign-up fields prefilled.
          </Text>
        ),
      },
      "patient-import": {
        title: "Patient Bulk Import",
        content: (
          <Text>
            If you are a school or facility that needs to add both therapists
            and students, it can be easily done. Through the Kidz-N-Motion
            online portal, organizations and therapists alike will be able to
            send user invites via a <CSV>.CSV </CSV>
            file upload , in addition to the manual sign-up method. This means
            that a properly compiled spreadsheet can be submitted to send
            invites to a large number of users at once. An example of this
            spreadsheet is available for download. The excel sheet has two cells
            labeled, email and role (guardian, administrator, therapist) to fill
            in for submission. Login, click ‘Patients’, then click ‘Upload
            Patients.’ Then click on ‘Download Template.’ The file should
            appear, fill, save, then click ‘Upload File’. Next click ‘Upload and
            continue’. Review the information for accuracy then click ‘Bulk
            Upload.’ Upon submitting, it will simultaneously send email invites
            to all of the users listed on the document.
          </Text>
        ),
      },
    };
    if (router && router.query) {
      return pages[router.query.slug];
    }
    return {};
  };

  return (
    <SupportArticleWrapper>
      <NextSeo title={renderContent().title} />
      <PageHeader title={renderContent().title} backURL="/support" />
      {/* <Title level={2}> {renderContent().title}</Title> */}
      {renderContent().content}
    </SupportArticleWrapper>
  );
}

export default Support;
