package com.calcom.runner;

import org.testng.TestNG;
import org.testng.xml.XmlClass;
import org.testng.xml.XmlSuite;
import org.testng.xml.XmlTest;

import java.util.ArrayList;
import java.util.List;

public class TestRunner {

    public static void main(String[] args) {
        TestNG testNG = new TestNG();

        XmlSuite suite = new XmlSuite();
        suite.setName("Cal.com Teams Automation Suite");
        suite.setParallel(XmlSuite.ParallelMode.NONE);

        XmlTest test = new XmlTest(suite);
        test.setName("Create New Team Tests");

        List<XmlClass> classes = new ArrayList<>();
        classes.add(new XmlClass("com.calcom.tests.CreateNewTeamTest"));
        test.setXmlClasses(classes);

        List<XmlSuite> suites = new ArrayList<>();
        suites.add(suite);

        testNG.setXmlSuites(suites);
        testNG.run();
    }
}
