package edu.cit.villarta.quickclinic.activity

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import edu.cit.villarta.quickclinic.R

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        // NavHostFragment handles all navigation from here
    }
}
