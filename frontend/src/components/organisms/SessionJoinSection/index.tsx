import React from 'react';
import ParticipantNameSetup from '../ParticipantNameSetup';
import ParticipantInfo from '../ParticipantInfo';
import SessionJoinForm from '../SessionJoinForm';

interface SessionJoinSectionProps {
  studyId?: number;
  studyNameDisplay: string;
  sessionId: string;
  livekitUrl: string;
  participantName: string;
  isLoading: boolean;
  onParticipantNameChange: (name: string) => void;
  onJoinSession: () => void;
}

const SessionJoinSection: React.FC<SessionJoinSectionProps> = ({
  studyId,
  studyNameDisplay,
  sessionId,
  livekitUrl,
  participantName,
  isLoading,
  onParticipantNameChange,
  onJoinSession,
}) => {
  return (
    <div className="bg-gray-800 m-4 rounded-lg p-4 flex-shrink-0">
      <h3 className="text-base font-semibold mb-3 text-white">화상회의 참가</h3>
      
      {/* 참가자 이름 설정 */}
      {!participantName && (
        <ParticipantNameSetup
          participantName={participantName}
          onParticipantNameChange={onParticipantNameChange}
        />
      )}

      {/* 참가자 정보 표시 */}
      {participantName && (
        <ParticipantInfo
          participantName={participantName}
          onParticipantNameChange={onParticipantNameChange}
        />
      )}

      {/* 세션 정보 */}
      <SessionJoinForm
        studyId={studyId}
        studyNameDisplay={studyNameDisplay}
        sessionId={sessionId}
        livekitUrl={livekitUrl}
        participantName={participantName}
        isLoading={isLoading}
        onJoinSession={onJoinSession}
      />
    </div>
  );
};

export default SessionJoinSection;
