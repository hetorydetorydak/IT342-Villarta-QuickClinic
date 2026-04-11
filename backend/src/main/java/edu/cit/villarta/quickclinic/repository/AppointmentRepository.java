package edu.cit.villarta.quickclinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import edu.cit.villarta.quickclinic.model.Appointment;
import edu.cit.villarta.quickclinic.model.User;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUser(User user);
    List<Appointment> findByStatus(String status);
}
