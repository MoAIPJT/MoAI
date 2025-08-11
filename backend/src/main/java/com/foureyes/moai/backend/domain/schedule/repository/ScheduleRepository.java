package com.foureyes.moai.backend.domain.schedule.repository;

import com.foureyes.moai.backend.domain.schedule.entity.Schedule;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    Optional<Schedule> findById(Integer id);

    @Query("""
      select s from Schedule s
      where s.studyGroup.id = :studyId
        and s.startDatetime < :to
        and s.endDatetime   > :from
      order by s.startDatetime asc
    """)
    List<Schedule> findOverlapping(@Param("studyId") Integer studyId,
                                   @Param("from") LocalDateTime from,
                                   @Param("to") LocalDateTime to);
}
