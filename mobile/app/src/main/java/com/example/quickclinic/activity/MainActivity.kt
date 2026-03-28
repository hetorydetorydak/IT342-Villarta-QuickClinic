package com.example.quickclinic.activity

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.quickclinic.R

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        // NavHostFragment handles all navigation from here
    }
}
